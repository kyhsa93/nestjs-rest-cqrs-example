import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { RemitCommand } from 'src/accounts/application/commands/remit.command';
import { RemitHandler } from 'src/accounts/application/commands/remit.handler';

import { AccountRepository } from 'src/accounts/domain/repository';
import { AccountService } from 'src/accounts/domain/service';

describe('RemitHandler', () => {
  let handler: RemitHandler;
  let repository: AccountRepository;
  let publisher: EventPublisher;
  let domainService: AccountService;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: 'AccountRepositoryImplement',
      useValue: {},
    };
    const publisherProvider: Provider = {
      provide: EventPublisher,
      useValue: {},
    };
    const domainServiceProvider: Provider = {
      provide: AccountService,
      useValue: {},
    };
    const providers: Provider[] = [
      RemitHandler,
      repoProvider,
      publisherProvider,
      domainServiceProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(RemitHandler);
    repository = testModule.get('AccountRepositoryImplement');
    publisher = testModule.get(EventPublisher);
    domainService = testModule.get(AccountService);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(undefined);

      const command = new RemitCommand({ id: 'senderId', receiverId: 'receiverId', amount: 1, password: 'password'});

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should execute RemitCommand', async () => {
      repository.findById = jest.fn().mockResolvedValue({});
      repository.save = jest.fn().mockResolvedValue(undefined);
      domainService.remit = jest.fn().mockReturnValue(undefined);
      publisher.mergeObjectContext = jest.fn().mockReturnValue({
        commit: () => undefined,
      });

      const command = new RemitCommand({ id: 'senderId', receiverId: 'receiverId', amount: 1, password: 'password'});

      await expect(handler.execute(command)).resolves.toEqual(undefined);
    });
  });
});
