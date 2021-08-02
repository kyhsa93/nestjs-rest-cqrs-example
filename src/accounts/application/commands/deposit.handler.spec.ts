import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { DepositCommand } from 'src/accounts/application/commands/deposit.command';
import { DepositHandler } from 'src/accounts/application/commands/deposit.handler';
import { InjectionToken } from 'src/accounts/application/injection.token';

import { AccountRepository } from 'src/accounts/domain/repository';

describe('DepositHandler', () => {
  let handler: DepositHandler;
  let repository: AccountRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.ACCOUNT_REPOSITORY,
      useValue: {},
    };
    const providers: Provider[] = [
      DepositHandler,
      repoProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(DepositHandler);
    repository = testModule.get(InjectionToken.ACCOUNT_REPOSITORY);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new DepositCommand({
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

    it('should execute DepositCommand', async () => {
      const account = { deposit: jest.fn().mockReturnValue(undefined), commit: jest.fn().mockReturnValue(undefined) };

      repository.findById = jest.fn().mockResolvedValue(account);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new DepositCommand({
        id: 'accountId',
        password: 'password',
        amount: 1,
      });

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(account.deposit).toBeCalledTimes(1);
      expect(account.deposit).toBeCalledWith(command.amount);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(account);
      expect(account.commit).toBeCalledTimes(1);
    });
  });
});
