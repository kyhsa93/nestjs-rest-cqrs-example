import { ModuleMetadata, Provider } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { OpenAccountCommand } from 'src/accounts/application/commands/open-account.command';
import { OpenAccountHandler } from 'src/accounts/application/commands/open-account.handler';

import { AccountRepository } from 'src/accounts/domain/repository';

describe('OpenAccountHandler', () => {
  let handler: OpenAccountHandler;
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
      OpenAccountHandler,
      repoProvider,
      publisherProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(OpenAccountHandler);
    repository = testModule.get('AccountRepositoryImplement');
    publisher = testModule.get(EventPublisher);
  });

  describe('execute', () => {
    it('should execute OpenAccountCommand', async () => {
      const account = { open: jest.fn(), commit: jest.fn(), setPassword: jest.fn() };

      repository.newId = jest.fn().mockResolvedValue('accountId');
      repository.save = jest.fn().mockResolvedValue(undefined);
      publisher.mergeObjectContext = jest.fn().mockReturnValue(account);

      const command = new OpenAccountCommand('accountId', 'password');

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.newId).toBeCalledTimes(1);
      expect(publisher.mergeObjectContext).toBeCalledTimes(1);
      expect(account.setPassword).toBeCalledTimes(1);
      expect(account.setPassword).toBeCalledWith(command.password);
      expect(account.open).toBeCalledTimes(1);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(account);
      expect(account.commit).toBeCalledTimes(1);
    });
  });
});
