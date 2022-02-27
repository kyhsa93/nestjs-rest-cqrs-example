import {
  ModuleMetadata,
  NotFoundException,
  Provider,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { RemitCommand } from 'src/account/application/commands/remit.command';
import { RemitHandler } from 'src/account/application/commands/remit.handler';
import { InjectionToken } from 'src/account/application/injection.token';

import { AccountRepository } from 'src/account/domain/repository';
import { AccountService } from 'src/account/domain/service';

describe('RemitHandler', () => {
  let handler: RemitHandler;
  let repository: AccountRepository;
  let domainService: AccountService;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.ACCOUNT_REPOSITORY,
      useValue: {},
    };
    const domainServiceProvider: Provider = {
      provide: AccountService,
      useValue: {},
    };
    const providers: Provider[] = [
      RemitHandler,
      repoProvider,
      domainServiceProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(RemitHandler);
    repository = testModule.get(InjectionToken.ACCOUNT_REPOSITORY);
    domainService = testModule.get(AccountService);
  });

  describe('execute', () => {
    it('should throw UnprocessableEntityException when id and receiverId is same', async () => {
      const command = new RemitCommand({
        id: 'accountId',
        receiverId: 'accountId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should throw NotFoundException when repository found no account', async () => {
      repository.findByIds = jest.fn().mockResolvedValue([]);

      const command = new RemitCommand({
        id: 'accountId',
        receiverId: 'receiverId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
    });

    it('should throw NotFoundException when repository found just single account', async () => {
      repository.findByIds = jest.fn().mockResolvedValue([{}]);

      const command = new RemitCommand({
        id: 'accountId',
        receiverId: 'receiverId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
    });

    it('should throw NotFoundException when account not found', async () => {
      const account = { compareId: (id: string) => id === 'wrongId' };
      const receiver = { compareId: (id: string) => id === 'receiverId' };

      repository.findByIds = jest.fn().mockResolvedValue([account, receiver]);

      const command = new RemitCommand({
        id: 'accountId',
        receiverId: 'receiverId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
    });

    it('should throw UnprocessableEntityException receiver is not found', async () => {
      const account = { compareId: (id: string) => id === 'accountId' };
      const receiver = { compareId: (id: string) => id === 'wrongId' };

      repository.findByIds = jest.fn().mockResolvedValue([account, receiver]);
      domainService.remit = jest.fn();
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new RemitCommand({
        id: 'accountId',
        receiverId: 'receiverId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        UnprocessableEntityException,
      );
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
    });

    it('should execute RemitCommand', async () => {
      const account = {
        commit: jest.fn(),
        compareId: (id: string) => id === 'accountId',
      };
      const receiver = {
        commit: jest.fn(),
        compareId: (id: string) => id === 'receiverId',
      };

      repository.findByIds = jest.fn().mockResolvedValue([account, receiver]);
      repository.save = jest.fn().mockResolvedValue(undefined);
      domainService.remit = jest.fn().mockReturnValue(undefined);

      const command = new RemitCommand({
        id: 'accountId',
        receiverId: 'receiverId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
      expect(domainService.remit).toBeCalledTimes(1);
      expect(domainService.remit).toBeCalledWith({
        account,
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
