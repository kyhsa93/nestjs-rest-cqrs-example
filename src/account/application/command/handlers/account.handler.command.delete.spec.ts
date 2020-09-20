import { NotFoundException, Provider, UnauthorizedException } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces";
import { EventPublisher } from "@nestjs/cqrs";
import { Test } from "@nestjs/testing";

import AccountRepository from "src/account/infrastructure/repository/account.repository";

import DeleteAccountCommandHandler from "src/account/application/command/handlers/account.handler.command.delete";
import DeleteAccountCommand from "src/account/application/command/implements/account.command.delete";

import Account from "src/account/domain/model/account.model";

describe('DeleteAccountCommandHandler', () => {
  let accountRepository: AccountRepository;
  let eventPublisher: EventPublisher;
  let deleteAccountCommandHandler: DeleteAccountCommandHandler;

  beforeEach(async () => {
    const accountRepositoryProvider: Provider = { provide: AccountRepository, useValue: {} };
    const eventPublisherProvider: Provider = { provide: EventPublisher, useValue: {} };
    const deleteAccountCommandHandlerProvider: Provider = { provide: DeleteAccountCommandHandler, useValue: {} };

    const providers: Provider[] = [
      accountRepositoryProvider,
      eventPublisherProvider,
      deleteAccountCommandHandlerProvider,
    ];
    
    const moduleMetadata: ModuleMetadata ={ providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    accountRepository = testModule.get(AccountRepository)    ;
    eventPublisher = testModule.get(EventPublisher);
    deleteAccountCommandHandler = testModule.get(DeleteAccountCommandHandler);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account is not found', () => {
      const command = new DeleteAccountCommand('id', 'password');

      jest.spyOn(accountRepository, 'findById').mockResolvedValue(undefined);

      expect(deleteAccountCommandHandler.execute(command)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when password is not matched', () => {
      const command = new DeleteAccountCommand('id', 'password');

      const account = {} as Account;
      jest.spyOn(accountRepository, 'findById').mockResolvedValue(account);
      jest.spyOn(account, 'comparePassword').mockReturnValue(false);

      expect(deleteAccountCommandHandler.execute(command)).rejects.toThrow(UnauthorizedException);
    });

    it('should return Promise<void>', () => {
      const command = new DeleteAccountCommand('id', 'password');

      const account = {} as Account;
      jest.spyOn(accountRepository, 'findById').mockResolvedValue(account);
      jest.spyOn(account, 'comparePassword').mockReturnValue(true);

      expect(deleteAccountCommandHandler.execute(command)).resolves.toEqual(undefined);
    })
  })
});
