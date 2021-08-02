import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { WithdrawCommand } from 'src/accounts/application/commands/withdraw.command';
import { WithdrawHandler } from 'src/accounts/application/commands/withdraw.handler';
import { InjectionToken } from 'src/accounts/application/injection.token';

import { AccountRepository } from 'src/accounts/domain/repository';

describe('WithdrawHandler', () => {
  let handler: WithdrawHandler;
  let repository: AccountRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.ACCOUNT_REPOSITORY,
      useValue: {},
    };
    const providers: Provider[] = [
      WithdrawHandler,
      repoProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(WithdrawHandler);
    repository = testModule.get(InjectionToken.ACCOUNT_REPOSITORY);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new WithdrawCommand({
        id: 'accountId',
        password: 'password',
        amount: 1,
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
    });

    it('should execute WithdrawCommand', async () => {
      const account = { withdraw: jest.fn(), commit: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue(account);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new WithdrawCommand({
        id: 'accountId',
        password: 'password',
        amount: 1,
      });

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(account.withdraw).toBeCalledTimes(1);
      expect(account.withdraw).toBeCalledWith(command.amount, command.password);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(account);
      expect(account.commit).toBeCalledTimes(1);
    });
  });
});
