import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CloseAccountCommand } from 'src/account/application/command/CloseAccountCommand';
import { CloseAccountHandler } from 'src/account/application/command/CloseAccountHandler';
import { InjectionToken } from 'src/account/application/InjectionToken';

import { AccountRepository } from 'src/account/domain/AccountRepository';

jest.mock('libs/Transactional', () => ({
  Transactional: () => () => undefined,
}));

describe('CloseAccountHandler', () => {
  let handler: CloseAccountHandler;
  let repository: AccountRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.ACCOUNT_REPOSITORY,
      useValue: {},
    };
    const providers: Provider[] = [CloseAccountHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(CloseAccountHandler);
    repository = testModule.get(InjectionToken.ACCOUNT_REPOSITORY);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new CloseAccountCommand('accountId');

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(command.accountId);
    });

    it('should execute CloseAccountCommand', async () => {
      const account = { close: jest.fn(), commit: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue(account);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new CloseAccountCommand('accountId');

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(command.accountId);
      expect(account.close).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(account);
      expect(account.commit).toHaveBeenCalledTimes(1);
    });
  });
});
