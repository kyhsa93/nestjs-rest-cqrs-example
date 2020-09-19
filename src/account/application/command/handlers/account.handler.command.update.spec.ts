import { NotFoundException, Provider } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces";
import { EventPublisher } from "@nestjs/cqrs";
import { Test } from "@nestjs/testing";

import AccountRepository from "src/account/infrastructure/repository/account.repository";

import { UpdateAccountCommandHandler } from "src/account/application/command/handlers/account.handler.command.update";
import UpdateAccountCommand from "src/account/application/command/implements/account.command.update";

import Account from "src/account/domain/model/account.model";

describe('UpdateAccountCommandHandler', () => {
  let accountRepository: AccountRepository;
  let eventPublisher: EventPublisher;
  let updateAccountCommandHandler: UpdateAccountCommandHandler;

  beforeEach(async () => {
    const providers: Provider[] = [AccountRepository, EventPublisher, UpdateAccountCommandHandler];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    accountRepository = testModule.get(AccountRepository);
    eventPublisher = testModule.get(EventPublisher);
    updateAccountCommandHandler = testModule.get(UpdateAccountCommandHandler);
  });

  describe('execute', () => {
    it('should throw NotFoundException when account is not found', () => {
      const command = new UpdateAccountCommand('id', 'old', 'new');

      jest.spyOn(accountRepository, 'findById').mockResolvedValue(undefined);

      expect(updateAccountCommandHandler.execute(command)).toThrow(NotFoundException);
    });

    it('should return Promise<void>', () => {
      const command = new UpdateAccountCommand('id', 'old', 'new');

      const account = {} as Account;
      jest.spyOn(accountRepository, 'findById').mockResolvedValue(account);
      jest.spyOn(account, 'updatePassword').mockReturnValue(undefined);
      jest.spyOn(accountRepository, 'save').mockResolvedValue(undefined);

      expect(updateAccountCommandHandler.execute(command)).resolves.toEqual(undefined);
    });
  });
});
