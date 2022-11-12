import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/PasswordModule';

import { UpdatePasswordCommand } from 'src/account/application/command/UpdatePasswordCommand';
import { UpdatePasswordHandler } from 'src/account/application/command/UpdatePasswordHandler';
import { InjectionToken } from 'src/account/application/InjectionToken';

import { AccountRepository } from 'src/account/domain/AccountRepository';

jest.mock('libs/Transactional', () => ({
  Transactional: () => () => undefined,
}));

describe('UpdatePasswordHandler', () => {
  let handler: UpdatePasswordHandler;
  let repository: AccountRepository;
  let passwordGenerator: PasswordGenerator;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.ACCOUNT_REPOSITORY,
      useValue: {},
    };
    const passwordGeneratorProvider: Provider = {
      provide: PASSWORD_GENERATOR,
      useValue: {},
    };
    const providers: Provider[] = [
      UpdatePasswordHandler,
      repoProvider,
      passwordGeneratorProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(UpdatePasswordHandler);
    repository = testModule.get(InjectionToken.ACCOUNT_REPOSITORY);
    passwordGenerator = testModule.get(PASSWORD_GENERATOR);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new UpdatePasswordCommand('accountId', 'password');

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.accountId);
    });

    it('should execute UpdatePasswordCommand', async () => {
      const account = { updatePassword: jest.fn(), commit: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue(account);
      repository.save = jest.fn().mockResolvedValue(undefined);
      passwordGenerator.generateKey = jest.fn().mockReturnValue('password');

      const command = new UpdatePasswordCommand('accountId', 'password');

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.accountId);
      expect(account.updatePassword).toBeCalledTimes(1);
      expect(account.updatePassword).toBeCalledWith(command.password);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(account);
      expect(account.commit).toBeCalledTimes(1);
    });
  });
});
