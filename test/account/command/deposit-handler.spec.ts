import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { DepositCommand } from 'src/account/application/command/deposit-command';
import { DepositHandler } from 'src/account/application/command/deposit-handler';

import { AccountRepository } from 'src/account/domain/account-repository';
import { ErrorMessage } from 'src/account/domain/error-message';

jest.mock('libs/database/transactional', () => ({
  Transactional: () => () => undefined,
}));

describe('DepositHandler', () => {
  let handler: DepositHandler;
  let repository: AccountRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: AccountRepository,
      useValue: {},
    };
    const providers: Provider[] = [DepositHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(DepositHandler);
    repository = testModule.get(AccountRepository);
  });

  describe('execute', () => {
    it('should throw error when account not found', async () => {
      repository.findAccounts = jest.fn().mockResolvedValue({ accounts: [] });

      const command = new DepositCommand('accountId', 1);

      await expect(handler.execute(command)).rejects.toThrow(
        ErrorMessage.ACCOUNT_IS_NOT_FOUND,
      );
      expect(repository.findAccounts).toHaveBeenCalledTimes(1);
      expect(repository.findAccounts).toHaveBeenCalledWith({
        id: command.accountId,
        take: 1,
        page: 0,
      });
    });

    it('should execute DepositCommand', async () => {
      const account = {
        deposit: jest.fn().mockReturnValue(undefined),
      };

      repository.findAccounts = jest
        .fn()
        .mockResolvedValue({ accounts: [account] });
      repository.saveAccount = jest.fn().mockResolvedValue(undefined);

      const command = new DepositCommand('accountId', 1);

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findAccounts).toHaveBeenCalledTimes(1);
      expect(account.deposit).toHaveBeenCalledTimes(1);
      expect(account.deposit).toHaveBeenCalledWith(command.amount);
      expect(repository.saveAccount).toHaveBeenCalledTimes(1);
      expect(repository.saveAccount).toHaveBeenCalledWith(account);
    });
  });
});
