import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, CommandBus, QueryBus } from '@nestjs/cqrs';
import { INestApplication } from '@nestjs/common';
import AccountController from './account.controller';
import { CreateAccountCommand } from '../application/command/implements/account.command.create';
import CreateAccountDTO from './dto/account.dto.create';
import { ReadAccountListQuery } from '../application/query/implements/account.query.list';
import ReadAccountListDTO from './dto/account.dto.read.list';
import Account from '../domain/model/account.model';
import ReadAccountDTO from './dto/account.dto.read';
import { ReadAccountQuery } from '../application/query/implements/account.query';
import { UpdateAccountCommand } from '../application/command/implements/account.command.update';
import { DeleteAccountCommand } from '../application/command/implements/account.command.delete';
import AccountUserDTO from './dto/account.dto.user';
import UpdateAccountParamDTO from './dto/account.dto.update.param';
import UpdateAccountBodyDTO from './dto/account.dto.update.body';
import UpdateAccountDTO from './dto/account.dto.update';
import DeleteAccountParamDTO from './dto/account.dto.delete.param';
import DeleteAccountBodyDTO from './dto/account.dto.delete.body';
import DeleteAccountDTO from './dto/account.dto.delete';

describe('AccountController', () => {
  let module: TestingModule;
  let app: INestApplication;
  let accountController: AccountController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CqrsModule], controllers: [AccountController],
    }).compile();

    app = module.createNestApplication();

    await app.init();

    accountController = module.get(AccountController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  afterAll(async (): Promise<void> => app.close());

  describe('create', () => {
    const email = 'test@test.com';
    const password = 'password';
    const name = 'tester';
    const createAccountDto = new CreateAccountDTO(email, password, name);
    const createAccountCommand = new CreateAccountCommand(createAccountDto);

    it('create method call commandBus with command', async () => {
      const spy = jest.spyOn(commandBus, 'execute').mockImplementation(() => Promise.resolve());
      await accountController.create(createAccountDto);
      expect(spy).toBeCalledWith(createAccountCommand);
    });
  });

  describe('getAccountByEmailAndPassword', () => {
    const email = 'test@test.com';
    const password = 'password';
    const account = new Account('id', 'accountName', 'accountEmail', 'accountPassword', true);
    const readAccountListDto = new ReadAccountListDTO(email, password);
    const readAccountListQuery = new ReadAccountListQuery(readAccountListDto);

    it('getAccountByEmailAndPassword method call queryBus with query', async () => {
      const spy = jest.spyOn(queryBus, 'execute').mockImplementation(() => Promise.resolve(account));
      await accountController.getAccountByEmailAndPassword(readAccountListDto);
      expect(spy).toBeCalledWith(readAccountListQuery);
    });
  });

  describe('getAccount', () => {
    const account = new Account('id', 'accountName', 'accountEmail', 'accountPassword', true);
    const readAccountDto = new ReadAccountDTO('id');
    const readAccountQeury = new ReadAccountQuery(readAccountDto);
    const user = new AccountUserDTO('id', 'accountEmail', 'accountName');
    it('getAccount method call queryBus with query', async () => {
      const spy = jest.spyOn(queryBus, 'execute').mockImplementation(() => Promise.resolve(account));
      await accountController.getAccount({ user }, readAccountDto);
      expect(spy).toBeCalledWith(readAccountQeury);
    });
  });

  describe('updateAccount', () => {
    const updateAccountParamDto = new UpdateAccountParamDTO('id');
    const updateAccountBodyDto = new UpdateAccountBodyDTO('newPassword', 'oldPassword');
    const updateAccountDto = new UpdateAccountDTO(updateAccountParamDto, updateAccountBodyDto);
    const updateAccountCommand = new UpdateAccountCommand(updateAccountDto);
    const user = new AccountUserDTO('id', 'accountEmail', 'accountName');
    it('updateAccount method call commndBus with command', async () => {
      const spy = jest.spyOn(commandBus, 'execute').mockImplementation(() => Promise.resolve());
      await accountController.updateAccount({ user }, updateAccountParamDto, updateAccountBodyDto);
      expect(spy).toBeCalledWith(updateAccountCommand);
    });
  });

  describe('deleteAccount', () => {
    const deleteAccountParamDto = new DeleteAccountParamDTO('id');
    const deleteAccountBodyDto = new DeleteAccountBodyDTO('password');
    const deleteAccountDto = new DeleteAccountDTO(deleteAccountParamDto, deleteAccountBodyDto);
    const deleteAccountCommand = new DeleteAccountCommand(deleteAccountDto);
    const user: AccountUserDTO = new AccountUserDTO('id', 'accountEmail', 'accountName');
    it('deleteAccount method call commandBus tiwh command', async () => {
      const spy = jest.spyOn(commandBus, 'execute').mockImplementation();
      await accountController.deleteAccount({ user }, deleteAccountParamDto, deleteAccountBodyDto);
      expect(spy).toBeCalledWith(deleteAccountCommand);
    });
  });
});
