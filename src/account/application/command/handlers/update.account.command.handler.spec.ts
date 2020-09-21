import { NotFoundException, Provider } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { EventPublisher } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import AccountRepository from 'src/account/infrastructure/repository/account.repository';

import UpdateAccountCommandHandler from '@src/account/application/command/handlers/update.account.command.handler';
import UpdateAccountCommand from '@src/account/application/command/implements/update.account.command';

import Account from 'src/account/domain/model/account.model';

describe('UpdateAccountCommandHandler', () => {
  let accountRepository: AccountRepository;
  let eventPublisher: EventPublisher;
  let updateAccountCommandHandler: UpdateAccountCommandHandler;

  beforeEach(async () => {
    const accountRepositoryProvider: Provider = { provide: AccountRepository, useValue: {} };
    const eventPublisherProvider: Provider = { provide: EventPublisher, useValue: {} };

    const providers: Provider[] = [
      accountRepositoryProvider,
      eventPublisherProvider,
      UpdateAccountCommandHandler,
    ];

    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    accountRepository = testModule.get(AccountRepository);
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
