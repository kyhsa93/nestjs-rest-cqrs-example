import { NotFoundException, Provider, UnauthorizedException } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { EventPublisher } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import DeleteAccountCommandHandler from '@src/account/application/command/handlers/delete.account';
import DeleteAccountCommand from '@src/account/application/command/implements/delete.account';

import Account from '@src/account/domain/model/account';
import AccountRepository from '@src/account/domain/repository';

describe('DeleteAccountCommandHandler', () => {
  let accountRepository: AccountRepository;
  let eventPublisher: EventPublisher;
  let deleteAccountCommandHandler: DeleteAccountCommandHandler;

  beforeEach(async () => {
    const accountRepositoryProvider: Provider = { provide: 'AccountRepositoryImplement', useValue: {} };
    const eventPublisherProvider: Provider = { provide: EventPublisher, useValue: {} };

    const providers: Provider[] = [
      accountRepositoryProvider,
      eventPublisherProvider,
      DeleteAccountCommandHandler,
    ];

    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    accountRepository = testModule.get('AccountRepositoryImplement');
    eventPublisher = testModule.get(EventPublisher);
    deleteAccountCommandHandler = testModule.get(DeleteAccountCommandHandler);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account is not found', async () => {
      const command = new DeleteAccountCommand('id', 'password');

      accountRepository.findById = jest.fn().mockResolvedValue(undefined);

      await expect(deleteAccountCommandHandler.execute(command)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when password is not matched', async () => {
      const command = new DeleteAccountCommand('id', 'password');

      const account = {} as Account;
      accountRepository.findById = jest.fn().mockResolvedValue(account);
      account.comparePassword = jest.fn().mockReturnValue(false);

      await expect(deleteAccountCommandHandler.execute(command)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return Promise<void>', async () => {
      const command = new DeleteAccountCommand('id', 'password');

      const account = {} as Account;
      accountRepository.findById = jest.fn().mockResolvedValue(account);
      account.comparePassword = jest.fn().mockReturnValue(true);
      eventPublisher.mergeObjectContext = jest.fn().mockReturnValue(account);
      account.delete = jest.fn().mockReturnValue(undefined);
      account.commit = jest.fn().mockReturnValue(undefined);
      accountRepository.save = jest.fn().mockResolvedValue(undefined);

      await expect(deleteAccountCommandHandler.execute(command)).resolves.toEqual(undefined);
    });
  });
});
