import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { RemitCommand } from 'src/account/application/command/remit-command';
import { RemitHandler } from 'src/account/application/command/remit-handler';

import { AccountRepository } from 'src/account/domain/account-repository';
import { AccountDomainService } from 'src/account/domain/account-domain-service';
import { ErrorMessage } from 'src/account/domain/error-message';

jest.mock('libs/transactional', () => ({
  Transactional: () => () => undefined,
}));

describe('RemitHandler', () => {
  let handler: RemitHandler;
  let repository: AccountRepository;
  let domainService: AccountDomainService;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: AccountRepository,
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
    repository = testModule.get(AccountRepository);
    domainService = testModule.get(AccountDomainService);
  });

  describe('execute', () => {
    it('should throw error when id and receiverId is same', async () => {
      const command = new RemitCommand('accountId', 'accountId', 1);

      await expect(handler.execute(command)).rejects.toThrow(
        ErrorMessage.WITHDRAWAL_AND_DEPOSIT_ACCOUNTS_CANNOT_BE_THE_SAME,
      );
    });

    it('should throw error when account is not found', async () => {
      repository.findById = jest.fn();

      const command = new RemitCommand('accountId', 'receiverId', 1);

      await expect(handler.execute(command)).rejects.toThrow(
        ErrorMessage.ACCOUNT_IS_NOT_FOUND,
      );
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(command.accountId);
    });

    it('should throw error when receiver is not found', async () => {
      repository.findById = jest
        .fn()
        .mockImplementation((id: string) => (id === 'accountId' ? {} : null));

      const command = new RemitCommand('accountId', 'receiverId', 1);

      await expect(handler.execute(command)).rejects.toThrow(
        ErrorMessage.ACCOUNT_IS_NOT_FOUND,
      );
      expect(repository.findById).toHaveBeenCalledTimes(2);
      expect(repository.findById).toHaveBeenCalledWith(command.accountId);
      expect(repository.findById).toHaveBeenCalledWith(command.receiverId);
    });

    it('should execute RemitCommand', async () => {
      const account = {
        compareId: (id: string) => id === 'accountId',
      };
      const receiver = {
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
      expect(repository.findById).toHaveBeenCalledTimes(2);
      expect(repository.findById).toHaveBeenCalledWith(command.accountId);
      expect(repository.findById).toHaveBeenCalledWith(command.receiverId);
      expect(domainService.remit).toHaveBeenCalledTimes(1);
      expect(domainService.remit).toHaveBeenCalledWith({
        ...command,
        account,
        receiver,
      });
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith([account, receiver]);
    });
  });
});
