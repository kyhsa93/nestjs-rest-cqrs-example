import {
  ModuleMetadata,
  NotFoundException,
  Provider,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { RemitCommand } from 'src/accounts/application/commands/remit.command';
import { RemitHandler } from 'src/accounts/application/commands/remit.handler';

import { AccountRepository } from 'src/accounts/domain/repository';
import { AccountService } from 'src/accounts/domain/service';

describe('RemitHandler', () => {
  let handler: RemitHandler;
  let repository: AccountRepository;
  let publisher: EventPublisher;
  let domainService: AccountService;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: 'AccountRepositoryImplement',
      useValue: {},
    };
    const publisherProvider: Provider = {
      provide: EventPublisher,
      useValue: {},
    };
    const domainServiceProvider: Provider = {
      provide: AccountService,
      useValue: {},
    };
    const providers: Provider[] = [
      RemitHandler,
      repoProvider,
      publisherProvider,
      domainServiceProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(RemitHandler);
    repository = testModule.get('AccountRepositoryImplement');
    publisher = testModule.get(EventPublisher);
    domainService = testModule.get(AccountService);
  });

  describe('execute', () => {
    it('should throw UnprocessableEntityException when id and receiverId is same', async () => {
      const command = new RemitCommand({
        id: 'senderId',
        receiverId: 'senderId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should throw NotFoundException when account not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(undefined);

      const command = new RemitCommand({
        id: 'senderId',
        receiverId: 'receiverId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
    });

    it('should throw UnprocessableEntityException receiver data is not found', async () => {
      const account = { commit: jest.fn() };

      repository.findById = jest
        .fn()
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce(undefined);
      publisher.mergeObjectContext = jest.fn().mockReturnValue(account);
      domainService.remit = jest.fn();
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new RemitCommand({
        id: 'senderId',
        receiverId: 'receiverId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        UnprocessableEntityException,
      );
      expect(repository.findById).toBeCalledTimes(2);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(repository.findById).toBeCalledWith(command.receiverId);
      expect(publisher.mergeObjectContext).toBeCalledTimes(1);
      expect(publisher.mergeObjectContext).toBeCalledWith({});
    });

    it('should execute RemitCommand', async () => {
      const accountData = {};
      const account = { commit: jest.fn() };
      const receiverData = {};
      const receiver = { commit: jest.fn() };

      repository.findById = jest
        .fn()
        .mockResolvedValueOnce(accountData)
        .mockResolvedValueOnce(receiverData);
      repository.save = jest.fn().mockResolvedValue(undefined);
      domainService.remit = jest.fn().mockReturnValue(undefined);
      publisher.mergeObjectContext = jest
        .fn()
        .mockReturnValueOnce(account)
        .mockReturnValueOnce(receiver);

      const command = new RemitCommand({
        id: 'senderId',
        receiverId: 'receiverId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(2);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(repository.findById).toBeCalledWith(command.receiverId);
      expect(publisher.mergeObjectContext).toBeCalledTimes(2);
      expect(publisher.mergeObjectContext).toBeCalledWith(accountData);
      expect(publisher.mergeObjectContext).toBeCalledWith(receiverData);
      expect(domainService.remit).toBeCalledTimes(1);
      expect(domainService.remit).toBeCalledWith({
        sender: account,
        receiver,
        password: command.password,
        amount: command.amount,
      });
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith([account, receiver]);
      expect(account.commit).toBeCalledTimes(1);
      expect(receiver.commit).toBeCalledTimes(1);
    });
  });
});
