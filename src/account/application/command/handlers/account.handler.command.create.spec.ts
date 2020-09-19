import { BadRequestException, Provider } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces";
import { Test } from "@nestjs/testing";

import AccountRepository from "src/account/infrastructure/repository/account.repository";

import { CreateAccountCommandHandler } from "src/account/application/command/handlers/account.handler.command.create";
import CreateAccountCommand from "src/account/application/command/implements/account.command.create";

import AccountFactory from "src/account/domain/model/account.factory";
import Account from "src/account/domain/model/account.model";
import { EventPublisher } from "@nestjs/cqrs";

describe('CreateAccountHandler', () => {
  let accountRepository: AccountRepository;
  let accountFactory: AccountFactory;
  let eventPublisher: EventPublisher;
  let createAccountCommandHandler: CreateAccountCommandHandler;

  beforeEach(async () => {
    const providers: Provider[] = [AccountFactory, AccountRepository, EventPublisher, CreateAccountCommandHandler];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    accountRepository = testModule.get(AccountRepository);
    accountFactory = testModule.get(AccountFactory);
    eventPublisher = testModule.get(EventPublisher);
    createAccountCommandHandler = testModule.get(CreateAccountCommandHandler);
  });

  describe('execute', () => {
    it('should throw BadRequestException when same email account is exists', () => {
      const command = new CreateAccountCommand('email', 'password');
      
      jest.spyOn(accountRepository, 'findByEmail').mockResolvedValue([{} as Account]);

      expect(createAccountCommandHandler.execute(command)).toThrow(BadRequestException);
    });

    it('should return Promise<void>', () => {
      const command = new CreateAccountCommand('email', 'password');

      jest.spyOn(accountRepository, 'findByEmail').mockResolvedValue([]);
      jest.spyOn(accountRepository, 'newId').mockResolvedValue('id');
      jest.spyOn(accountRepository, 'save').mockResolvedValue(undefined);

      expect(createAccountCommandHandler.execute(command)).resolves.toEqual(undefined);
    })
  });
});
