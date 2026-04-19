import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CloseAccountCommand } from 'src/account/application/command/close-account-command';
import { CloseAccountHandler } from 'src/account/application/command/close-account-handler';

import { AccountRepository } from 'src/account/domain/account-repository';
import { ErrorMessage } from 'src/account/domain/error-message';

jest.mock('libs/transactional', () => ({
  Transactional: () => () => undefined,
}));

describe('CloseAccountHandler', () => {
  let handler: CloseAccountHandler;
  let repository: AccountRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: AccountRepository,
      useValue: {},
    };
    const providers: Provider[] = [CloseAccountHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(CloseAccountHandler);
    repository = testModule.get(AccountRepository);
  });

  describe('execute', () => {
    it('should throw error when account not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new CloseAccountCommand('accountId');

      await expect(handler.execute(command)).rejects.toThrow(
        ErrorMessage.ACCOUNT_IS_NOT_FOUND,
      );
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(command.accountId);
    });

    it('should execute CloseAccountCommand', async () => {
      const account = { close: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue(account);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new CloseAccountCommand('accountId');

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(command.accountId);
      expect(account.close).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(account);
    });
  });
});
