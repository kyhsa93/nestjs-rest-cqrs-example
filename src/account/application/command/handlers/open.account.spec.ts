import { Provider } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { EventPublisher } from '@nestjs/cqrs';

import OpenAccountCommandHandler from '@src/account/application/command/handlers/open.account';
import OpenAccountCommand from '@src/account/application/command/implements/open.account';

import AccountFactory from '@src/account/domain/factory';
import Account from '@src/account/domain/model/account';
import AccountRepository from '@src/account/domain/repository';

jest.mock('typeorm', () => ({ Transaction: () => () => {} }));

describe('OpenAccountCommandHandler', () => {
  let accountRepository: AccountRepository;
  let accountFactory: AccountFactory;
  let eventPublisher: EventPublisher;
  let openAccountCommandHandler: OpenAccountCommandHandler;

  beforeEach(async () => {
    const accountFactoryProvider: Provider = { provide: AccountFactory, useValue: {} };
    const accountRepositoryProvider: Provider = {
      provide: 'AccountRepositoryImplement',
      useValue: {},
    };
    const eventPublisherProvider: Provider = { provide: EventPublisher, useValue: {} };

    const providers: Provider[] = [
      accountFactoryProvider,
      accountRepositoryProvider,
      eventPublisherProvider,
      OpenAccountCommandHandler,
    ];

    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    accountRepository = testModule.get('AccountRepositoryImplement');
    accountFactory = testModule.get(AccountFactory);
    eventPublisher = testModule.get(EventPublisher);
    openAccountCommandHandler = testModule.get(OpenAccountCommandHandler);
  });

  describe('execute', () => {
    it('should return Promise<void>', async () => {
      const command = new OpenAccountCommand('name', 'password');

      const account = {} as Account;
      account.commit = jest.fn().mockReturnValue(undefined);

      accountRepository.newId = jest.fn().mockResolvedValue('id');
      accountFactory.create = jest.fn().mockReturnValue(account);
      eventPublisher.mergeObjectContext = jest.fn().mockReturnValue(account);
      accountRepository.save = jest.fn().mockResolvedValue(undefined);

      await expect(openAccountCommandHandler.execute(command)).resolves.toEqual(undefined);
    });
  });
});
