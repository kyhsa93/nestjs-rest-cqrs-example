import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { UpdatePasswordCommand } from 'src/accounts/application/commands/update-password.command';
import { UpdatePasswordHandler } from 'src/accounts/application/commands/update-password.handler';

import { AccountRepository } from 'src/accounts/domain/repository';

describe('UpdatePasswordHandler', () => {
  let handler: UpdatePasswordHandler;
  let repository: AccountRepository;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: 'AccountRepositoryImplement',
      useValue: {},
    };
    const publisherProvider: Provider = {
      provide: EventPublisher,
      useValue: {},
    };
    const providers: Provider[] = [
      UpdatePasswordHandler,
      repoProvider,
      publisherProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(UpdatePasswordHandler);
    repository = testModule.get('AccountRepositoryImplement');
    publisher = testModule.get(EventPublisher);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(undefined);

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
      
      repository.findById = jest.fn().mockResolvedValue({});
      repository.save = jest.fn().mockResolvedValue(undefined);
      publisher.mergeObjectContext = jest.fn().mockReturnValue(account);

      const command = new UpdatePasswordCommand({
        id: 'accountId',
        password: 'password',
        newPassword: 'newPassword',
      });

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(publisher.mergeObjectContext).toBeCalledTimes(1);
      expect(publisher.mergeObjectContext).toBeCalledWith({});
      expect(account.updatePassword).toBeCalledTimes(1);
      expect(account.updatePassword).toBeCalledWith(command.password, command.newPassword);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(account);
      expect(account.commit).toBeCalledTimes(1);
    });
  });
});
