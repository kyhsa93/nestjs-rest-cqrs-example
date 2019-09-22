import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, CommandBus, QueryBus } from '@nestjs/cqrs';
import { AccountController } from './account.controller';
import { CreateAccountCommand } from '../application/command/account.command.create';
import { CreateAccountDTO } from './dto/account.dto.create';
import { INestApplication } from '@nestjs/common';
import { ReadAccountListQuery } from '../application/query/account.query.list';
import { ReadAccountListDTO } from './dto/account.dto.read.list';
import { Account } from '../domain/model/account.model';
import { ReadAccountDTO } from './dto/account.dto.read';
import { ReadAccountQuery } from '../application/query/account.query';
import { UpdateAccountParamDTO, UpdateAccountBodyDTO, UpdateAccountDTO } from './dto/account.dto.update';
import { UpdateAccountCommand } from '../application/command/account.command.update';
import { DeleteAccountParamDTO, DeleteAccountBodyDTO, DeleteAccountDTO } from './dto/account.dto.delete';
import { DeleteAccountCommand } from '../application/command/account.command.delete';

describe('AccountController', () =>{
  let module: TestingModule;
  let app: INestApplication;
  let accountController: AccountController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeAll(async () => {
    module = await Test.createTestingModule({ imports: [CqrsModule], controllers: [AccountController] }).compile();

    app = module.createNestApplication();

    await app.init();

    accountController = module.get(AccountController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  })

  afterAll(async () => {
    app.close();
    close();
  });

  describe('create', () => {
    const email: string = 'test@test.com';
    const password: string = 'password';
    const name: string = 'tester';
    const createAccountDto = new CreateAccountDTO(email, password, name);
    const createAccountCommand = new CreateAccountCommand(createAccountDto);

    it('create method call commandBus with command', async () => {
      jest.spyOn(commandBus, 'execute').mockImplementation(() => Promise.resolve());
      await accountController.create(createAccountDto);
      expect(commandBus.execute).toBeCalledWith(createAccountCommand);
    });
  });

  describe('getAccountByEmailAndPassword', () => {
    const email: string = 'test@test.com';
    const password: string = 'password';
    const account = new Account('accountId', 'accountName', 'accountEmail', 'accountPassword', true);
    const readAccountListDto: ReadAccountListDTO = new ReadAccountListDTO(email, password);
    const readAccountListQuery: ReadAccountListQuery = new ReadAccountListQuery(readAccountListDto);

    it('getAccountByEmailAndPassword method call queryBus with query', async () => {
      jest.spyOn(queryBus, 'execute').mockImplementation(() => Promise.resolve(account));
      await accountController.getAccountByEmailAndPassword(readAccountListDto);
      expect(queryBus.execute).toBeCalledWith(readAccountListQuery);
    });
  });

  describe('getAccount', () => {
    const account = new Account('accountId', 'accountName', 'accountEmail', 'accountPassword', true);
    const readAccountDto: ReadAccountDTO = new ReadAccountDTO('accountId');
    const readAccountQeury: ReadAccountQuery = new ReadAccountQuery(readAccountDto);
    it('getAccount method call queryBus with query', async () => {
      jest.spyOn(queryBus, 'execute').mockImplementation(() => Promise.resolve(account));
      await accountController.getAccount(readAccountDto);
      expect(queryBus.execute).toBeCalledWith(readAccountQeury);
    });
  });

  describe('updateAccount', () => {
    const updateAccountParamDto: UpdateAccountParamDTO = new UpdateAccountParamDTO('accountId');
    const updateAccountBodyDto: UpdateAccountBodyDTO = new UpdateAccountBodyDTO('newPassword', 'oldPassword');
    const updateAccountDto: UpdateAccountDTO = new UpdateAccountDTO(updateAccountParamDto, updateAccountBodyDto);
    const updateAccountCommand: UpdateAccountCommand = new UpdateAccountCommand(updateAccountDto);
    it('updateAccount method call commndBus with command', async () => {
      jest.spyOn(commandBus, 'execute').mockImplementation(() => Promise.resolve());
      await accountController.updateAccount(updateAccountParamDto, updateAccountBodyDto);
      expect(commandBus.execute).toBeCalledWith(updateAccountCommand);
    });
  });

  describe('deleteAccount', () => {
    const deleteAccountParamDto: DeleteAccountParamDTO = new DeleteAccountParamDTO('accountId');
    const deleteAccountBodyDto: DeleteAccountBodyDTO = new DeleteAccountBodyDTO('password');
    const deleteAccountDto: DeleteAccountDTO = new DeleteAccountDTO(deleteAccountParamDto, deleteAccountBodyDto);
    const deleteAccountCommand: DeleteAccountCommand = new DeleteAccountCommand(deleteAccountDto);
    it('deleteAccount method call commandBus tiwh command', async () => {
      jest.spyOn(commandBus, 'execute').mockImplementation();
      await accountController.deleteAccount(deleteAccountParamDto, deleteAccountBodyDto);
      expect(commandBus.execute).toBeCalledWith(deleteAccountCommand);
    });
  });
});
