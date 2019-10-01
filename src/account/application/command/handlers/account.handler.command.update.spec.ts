import { TestingModule, Test } from "@nestjs/testing";
import bcrypt from 'bcrypt-nodejs';
import { CqrsModule, EventPublisher } from "@nestjs/cqrs";
import { UpdateAccountCommandHandler } from './account.handler.command.update';
import { getRepositoryToken } from "@nestjs/typeorm";
import AccountEntity from "../../../infrastructure/entity/account.entity";
import { Repository, UpdateResult } from "typeorm";
import AccountRepository from "../../../infrastructure/repository/account.repository";
import Account from "../../../domain/model/account.model";
import { UpdateAccountCommand } from "../implements/account.command.update";
import UpdateAccountDTO from "../../../interface/dto/account.dto.update";
import UpdateAccountParamDTO from "../../../interface/dto/account.dto.update.param";
import UpdateAccountBodyDTO from "../../../interface/dto/account.dto.update.body";

describe('UpdateAccountCommandHandler', () => {
  let module: TestingModule;
  let accountRepository: AccountRepository;
  let accountEntity: AccountEntity;
  let eventPublisher: EventPublisher;
  let account: Account;
  let accountUpdateResult: UpdateResult;
  let updateAccountCommandhandler: UpdateAccountCommandHandler;
  let updateAccountCommand: UpdateAccountCommand;
  let updateAccountDto: UpdateAccountDTO;
  let updateAccountParamDto: UpdateAccountParamDTO;
  let updateAccountBodyDto: UpdateAccountBodyDTO;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UpdateAccountCommandHandler,
        { provide: getRepositoryToken(AccountEntity), useClass: Repository },
      ],
    }).compile();
    updateAccountCommandhandler = module.get(UpdateAccountCommandHandler);
    accountRepository = module.get<Repository<AccountEntity>>(getRepositoryToken(AccountEntity));
    eventPublisher = module.get(EventPublisher);
  });

  afterAll(async () => close());

  describe('execute', () => {
    accountEntity = new AccountEntity();
    account = new Account(accountEntity.accountId, accountEntity.name, accountEntity.email, accountEntity.password, accountEntity.active);
    accountUpdateResult = new UpdateResult();
    updateAccountParamDto = new UpdateAccountParamDTO(accountEntity.accountId);
    updateAccountBodyDto = new UpdateAccountBodyDTO('newPassword', 'oldPassword');
    updateAccountDto = new UpdateAccountDTO(updateAccountParamDto, updateAccountBodyDto);
    updateAccountCommand = new UpdateAccountCommand(updateAccountDto);

    it('execute command handler', async () => {
      jest.spyOn(accountRepository, 'findOneOrFail').mockResolvedValue(accountEntity);
      jest.spyOn(eventPublisher, 'mergeObjectContext').mockImplementation(() => account);
      jest.spyOn(account, 'comparePassword').mockImplementation(() => true);
      jest.spyOn(bcrypt, 'hashSync').mockImplementation(() => 'hashedNewPassword');
      jest.spyOn(accountRepository, 'update').mockResolvedValue(accountUpdateResult);
      const result = await updateAccountCommandhandler.execute(updateAccountCommand);
      expect(result).toBe(undefined);
    });
  });
});
