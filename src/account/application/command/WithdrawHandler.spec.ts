import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { WithdrawCommand } from 'src/account/application/command/WithdrawCommand';
import { WithdrawHandler } from 'src/account/application/command/WithdrawHandler';
import { InjectionToken } from 'src/account/application/InjectionToken';

import { AccountRepository } from 'src/account/domain/AccountRepository';
import { ErrorMessage } from 'src/account/domain/ErrorMessage';

jest.mock('libs/Transactional', () => ({
  Transactional: () => () => undefined,
}));

describe('WithdrawHandler', () => {
  let handler: WithdrawHandler;
  let repository: AccountRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.ACCOUNT_REPOSITORY,
      useValue: {},
    };
    const providers: Provider[] = [WithdrawHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(WithdrawHandler);
    repository = testModule.get(InjectionToken.ACCOUNT_REPOSITORY);
  });

  describe('execute', () => {
    it('should throw error when account not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new WithdrawCommand('accountId', 1);

      await expect(handler.execute(command)).rejects.toThrow(
        ErrorMessage.ACCOUNT_IS_NOT_FOUND,
      );
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(command.accountId);
    });

    it('should execute WithdrawCommand', async () => {
      const account = { withdraw: jest.fn(), commit: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue(account);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new WithdrawCommand('accountId', 1);

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(command.accountId);
      expect(account.withdraw).toHaveBeenCalledTimes(1);
      expect(account.withdraw).toHaveBeenCalledWith(command.amount);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(account);
      expect(account.commit).toHaveBeenCalledTimes(1);
    });
  });
});
