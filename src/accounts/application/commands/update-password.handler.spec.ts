import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { UpdatePasswordCommand } from 'src/accounts/application/commands/update-password.command';
import { UpdatePasswordHandler } from 'src/accounts/application/commands/update-password.handler';
import { InjectionToken } from 'src/accounts/application/injection.token';

import { AccountRepository } from 'src/accounts/domain/repository';

describe('UpdatePasswordHandler', () => {
  let handler: UpdatePasswordHandler;
  let repository: AccountRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.ACCOUNT_REPOSITORY,
      useValue: {},
    };
    const providers: Provider[] = [
      UpdatePasswordHandler,
      repoProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(UpdatePasswordHandler);
    repository = testModule.get(InjectionToken.ACCOUNT_REPOSITORY);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new UpdatePasswordCommand({
        id: 'accountId',
        password: 'password',
        newPassword: 'newPassword',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
    });

    it('should execute UpdatePasswordCommand', async () => {
      const account = { updatePassword: jest.fn(), commit: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue(account);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new UpdatePasswordCommand({
        id: 'accountId',
        password: 'password',
        newPassword: 'newPassword',
      });

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(account.updatePassword).toBeCalledTimes(1);
      expect(account.updatePassword).toBeCalledWith(
        command.password,
        command.newPassword,
      );
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(account);
      expect(account.commit).toBeCalledTimes(1);
    });
  });
});
