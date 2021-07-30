import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { CloseAccountCommand } from 'src/accounts/application/commands/close-account.command';
import { CloseAccountHandler } from 'src/accounts/application/commands/close-account.handler';

import { AccountRepository } from 'src/accounts/domain/repository';

describe('CloseAccountHandler', () => {
  let handler: CloseAccountHandler;
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
      CloseAccountHandler,
      repoProvider,
      publisherProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(CloseAccountHandler);
    repository = testModule.get('AccountRepositoryImplement');
    publisher = testModule.get(EventPublisher);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(undefined);

      const command = new CloseAccountCommand('accountId', 'password');

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
    });

    it('should execute CloseAccountCommand', async () => {
      const account = { close: jest.fn(), commit: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue({});
      repository.save = jest.fn().mockResolvedValue(undefined);
      publisher.mergeObjectContext = jest.fn().mockReturnValue(account);

      const command = new CloseAccountCommand('accountId', 'password');

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(publisher.mergeObjectContext).toBeCalledTimes(1);
      expect(publisher.mergeObjectContext).toBeCalledWith({});
      expect(account.close).toBeCalledTimes(1);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(account);
      expect(account.commit).toBeCalledTimes(1);
    });
  });
});
