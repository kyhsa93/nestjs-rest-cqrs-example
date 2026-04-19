import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/PasswordModule';

import { UpdatePasswordCommand } from 'src/account/application/command/UpdatePasswordCommand';
import { UpdatePasswordHandler } from 'src/account/application/command/UpdatePasswordHandler';

import { AccountRepository } from 'src/account/domain/account-repository';
import { ErrorMessage } from 'src/account/domain/ErrorMessage';

jest.mock('libs/Transactional', () => ({
  Transactional: () => () => undefined,
}));

describe('UpdatePasswordHandler', () => {
  let handler: UpdatePasswordHandler;
  let repository: AccountRepository;
  let passwordGenerator: PasswordGenerator;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: AccountRepository,
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
    repository = testModule.get(AccountRepository);
    passwordGenerator = testModule.get(PASSWORD_GENERATOR);
  });

  describe('execute', () => {
    it('should throw error when account not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new UpdatePasswordCommand('accountId', 'password');

      await expect(handler.execute(command)).rejects.toThrow(
        ErrorMessage.ACCOUNT_IS_NOT_FOUND,
      );
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(command.accountId);
    });

    it('should execute UpdatePasswordCommand', async () => {
      const account = { updatePassword: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue(account);
      repository.save = jest.fn().mockResolvedValue(undefined);
      passwordGenerator.generateKey = jest.fn().mockReturnValue('password');

      const command = new UpdatePasswordCommand('accountId', 'password');

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(command.accountId);
      expect(account.updatePassword).toHaveBeenCalledTimes(1);
      expect(account.updatePassword).toHaveBeenCalledWith(command.password);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(account);
    });
  });
});
