import { NotFoundException, Provider } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { EventPublisher } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import UpdateAccountCommandHandler from '@src/account/application/command/handlers/update.account';
import UpdateAccountCommand from '@src/account/application/command/implements/update.account';

import Account from '@src/account/domain/model/account';
import AccountRepository from '@src/account/domain/repository';

describe('UpdateAccountCommandHandler', () => {
  let accountRepository: AccountRepository;
  let eventPublisher: EventPublisher;
  let updateAccountCommandHandler: UpdateAccountCommandHandler;

  beforeEach(async () => {
    const accountRepositoryProvider: Provider = {
      provide: 'AccountRepositoryImplement',
      useValue: {},
    };
    const eventPublisherProvider: Provider = { provide: EventPublisher, useValue: {} };

    const providers: Provider[] = [
      accountRepositoryProvider,
      eventPublisherProvider,
      UpdateAccountCommandHandler,
    ];

    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    accountRepository = testModule.get('AccountRepositoryImplement');
    eventPublisher = testModule.get(EventPublisher);
    updateAccountCommandHandler = testModule.get(UpdateAccountCommandHandler);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account is not found', async () => {
      const command = new UpdateAccountCommand('id', 'old', 'new');

      accountRepository.findById = jest.fn().mockResolvedValue(undefined);

      await expect(updateAccountCommandHandler.execute(command)).rejects.toThrow(NotFoundException);
    });

    it('should return Promise<void>', async () => {
      const command = new UpdateAccountCommand('id', 'old', 'new');

      const account = {} as Account;
      account.updatePassword = jest.fn().mockReturnValue(undefined);
      account.commit = jest.fn().mockReturnValue(undefined);

      accountRepository.findById = jest.fn().mockResolvedValue(account);
      eventPublisher.mergeObjectContext = jest.fn().mockReturnValue(account);
      account.updatePassword = jest.fn().mockReturnValue(undefined);
      accountRepository.save = jest.fn().mockResolvedValue(undefined);

      await expect(updateAccountCommandHandler.execute(command)).resolves.toEqual(undefined);
    });
  });
});
