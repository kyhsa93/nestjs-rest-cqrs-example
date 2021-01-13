import { NotFoundException, Provider } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { EventPublisher } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import CloseAccountCommandHandler from '@src/account/application/command/handlers/close.account';
import CloseAccountCommand from '@src/account/application/command/implements/close.account';

import Account from '@src/account/domain/model/account';
import AccountRepository from '@src/account/domain/repository';

jest.mock('typeorm', () => ({ Transaction: () => () => {} }));

describe('CloseAccountCommandHandler', () => {
  let accountRepository: AccountRepository;
  let eventPublisher: EventPublisher;
  let closeAccountCommandHandler: CloseAccountCommandHandler;

  beforeEach(async () => {
    const accountRepositoryProvider: Provider = {
      provide: 'AccountRepositoryImplement',
      useValue: {},
    };
    const eventPublisherProvider: Provider = { provide: EventPublisher, useValue: {} };

    const providers: Provider[] = [
      accountRepositoryProvider,
      eventPublisherProvider,
      CloseAccountCommandHandler,
    ];

    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    accountRepository = testModule.get('AccountRepositoryImplement');
    eventPublisher = testModule.get(EventPublisher);
    closeAccountCommandHandler = testModule.get(CloseAccountCommandHandler);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account is not found', async () => {
      const command = new CloseAccountCommand('id', 'password');

      accountRepository.findById = jest.fn().mockResolvedValue(undefined);

      await expect(closeAccountCommandHandler.execute(command)).rejects.toThrow(NotFoundException);
    });

    it('should return Promise<void>', async () => {
      const command = new CloseAccountCommand('id', 'password');

      const account = {} as Account;
      accountRepository.findById = jest.fn().mockResolvedValue(account);
      eventPublisher.mergeObjectContext = jest.fn().mockReturnValue(account);
      account.close = jest.fn().mockReturnValue(undefined);
      account.commit = jest.fn().mockReturnValue(undefined);
      accountRepository.save = jest.fn().mockResolvedValue(undefined);

      await expect(closeAccountCommandHandler.execute(command)).resolves.toEqual(undefined);
    });
  });
});
