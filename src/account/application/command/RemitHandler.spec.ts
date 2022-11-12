import {
  ModuleMetadata,
  NotFoundException,
  Provider,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { RemitCommand } from 'src/account/application/command/RemitCommand';
import { RemitHandler } from 'src/account/application/command/RemitHandler';
import { InjectionToken } from 'src/account/application/InjectionToken';

import { AccountRepository } from 'src/account/domain/AccountRepository';
import { AccountDomainService } from 'src/account/domain/AccountDomainService';

jest.mock('libs/Transactional', () => ({
  Transactional: () => () => undefined,
}));

describe('RemitHandler', () => {
  let handler: RemitHandler;
  let repository: AccountRepository;
  let domainService: AccountDomainService;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.ACCOUNT_REPOSITORY,
      useValue: {},
    };
    const domainServiceProvider: Provider = {
      provide: AccountDomainService,
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
    domainService = testModule.get(AccountDomainService);
  });

  describe('execute', () => {
    it('should throw UnprocessableEntityException when id and receiverId is same', async () => {
      const command = new RemitCommand('accountId', 'accountId', 1);

      await expect(handler.execute(command)).rejects.toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should throw NotFoundException when account is not found', async () => {
      repository.findById = jest.fn();

      const command = new RemitCommand('accountId', 'receiverId', 1);

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.accountId);
    });

    it('should throw UnprocessableEntityException receiver is not found', async () => {
      repository.findById = jest
        .fn()
        .mockImplementation((id: string) => (id === 'accountId' ? {} : null));

      const command = new RemitCommand('accountId', 'receiverId', 1);

      await expect(handler.execute(command)).rejects.toThrowError(
        UnprocessableEntityException,
      );
      expect(repository.findById).toBeCalledTimes(2);
      expect(repository.findById).toBeCalledWith(command.accountId);
      expect(repository.findById).toBeCalledWith(command.receiverId);
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

      repository.findById = jest
        .fn()
        .mockImplementation((id: string) =>
          id === 'accountId' ? account : id === 'receiverId' ? receiver : null,
        );
      repository.save = jest.fn().mockResolvedValue(undefined);
      domainService.remit = jest.fn().mockReturnValue(undefined);

      const command = new RemitCommand('accountId', 'receiverId', 1);

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(2);
      expect(repository.findById).toBeCalledWith(command.accountId);
      expect(repository.findById).toBeCalledWith(command.receiverId);
      expect(domainService.remit).toBeCalledTimes(1);
      expect(domainService.remit).toBeCalledWith({
        ...command,
        account,
        receiver,
      });
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith([account, receiver]);
      expect(account.commit).toBeCalledTimes(1);
      expect(receiver.commit).toBeCalledTimes(1);
    });
  });
});
