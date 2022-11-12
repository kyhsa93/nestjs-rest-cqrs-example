import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/PasswordModule';

import { OpenAccountCommand } from 'src/account/application/command/OpenAccountCommand';
import { OpenAccountHandler } from 'src/account/application/command/OpenAccountHandler';
import { InjectionToken } from 'src/account/application/InjectionToken';
import { AccountFactory } from 'src/account/domain/AccountFactory';

import { AccountRepository } from 'src/account/domain/AccountRepository';

jest.mock('libs/Transactional', () => ({
  Transactional: () => () => undefined,
}));

describe('OpenAccountHandler', () => {
  let handler: OpenAccountHandler;
  let repository: AccountRepository;
  let factory: AccountFactory;
  let passwordGenerator: PasswordGenerator;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.ACCOUNT_REPOSITORY,
      useValue: {},
    };
    const factoryProvider: Provider = {
      provide: AccountFactory,
      useValue: {},
    };
    const passwordGeneratorProvider: Provider = {
      provide: PASSWORD_GENERATOR,
      useValue: {},
    };
    const providers: Provider[] = [
      OpenAccountHandler,
      repoProvider,
      factoryProvider,
      passwordGeneratorProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(OpenAccountHandler);
    repository = testModule.get(InjectionToken.ACCOUNT_REPOSITORY);
    factory = testModule.get(AccountFactory);
    passwordGenerator = testModule.get(PASSWORD_GENERATOR);
  });

  describe('execute', () => {
    it('should execute OpenAccountCommand', async () => {
      const account = { open: jest.fn(), commit: jest.fn() };

      factory.create = jest.fn().mockReturnValue(account);
      repository.newId = jest.fn().mockResolvedValue('accountId');
      repository.save = jest.fn().mockResolvedValue(undefined);
      passwordGenerator.generateKey = jest.fn().mockReturnValue('password');

      const command = new OpenAccountCommand('name', 'email', 'password');

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.newId).toBeCalledTimes(1);
      expect(account.open).toBeCalledTimes(1);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(account);
      expect(account.commit).toBeCalledTimes(1);
      expect(passwordGenerator.generateKey).toBeCalledWith(command.password);
      expect(passwordGenerator.generateKey).toBeCalledTimes(1);
    });
  });
});
