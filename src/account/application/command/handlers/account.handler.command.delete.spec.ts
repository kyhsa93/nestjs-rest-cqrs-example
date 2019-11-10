import { TestingModule, Test } from "@nestjs/testing";
import { CqrsModule, EventPublisher } from "@nestjs/cqrs";
import { getRepositoryToken } from "@nestjs/typeorm";
import AccountEntity from "../../../infrastructure/entity/account.entity";
import { Repository, UpdateResult } from "typeorm";
import { DeleteAccountCommandHandler } from './account.handler.command.delete';
import AccountRepository from "../../../infrastructure/repository/account.repository";
import Account from "../../../domain/model/account.model";
import { DeleteAccountCommand } from "../implements/account.command.delete";
import DeleteAccountDTO from "../../../interface/dto/account.dto.delete";
import DeleteAccountParamDTO from "../../../interface/dto/account.dto.delete.param";
import DeleteAccountBodyDTO from "../../../interface/dto/account.dto.delete.body";

describe('DeleteAccountCommandHandler', () => {
  let module: TestingModule;
  let deleteAccountCommandHandler: DeleteAccountCommandHandler;
  let accountRepository: AccountRepository;
  let eventPublisher: EventPublisher;
  let accountEntity: AccountEntity;
  let account: Account;
  let accountUpdateResult: UpdateResult;
  let deleteAccountCommand: DeleteAccountCommand;
  let deleteAccountDto: DeleteAccountDTO;
  let deleteAccountParamDto: DeleteAccountParamDTO;
  let deleteAccountBodyDto: DeleteAccountBodyDTO;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        DeleteAccountCommandHandler,
        { provide: getRepositoryToken(AccountEntity), useClass: Repository },
      ],
    }).compile();
    deleteAccountCommandHandler = module.get(DeleteAccountCommandHandler);
    accountRepository = module.get<Repository<AccountEntity>>(getRepositoryToken(AccountEntity));
    eventPublisher = module.get(EventPublisher);
  });

  afterAll(async () => close());

  describe('execute', () => {
    accountEntity = new AccountEntity()
    account = new Account(accountEntity.id, accountEntity.name, accountEntity.email, accountEntity.password, accountEntity.active);
    accountUpdateResult = new UpdateResult();
    deleteAccountParamDto = new DeleteAccountParamDTO('id');
    deleteAccountBodyDto = new DeleteAccountBodyDTO('password')
    deleteAccountDto = new DeleteAccountDTO(deleteAccountParamDto, deleteAccountBodyDto);
    deleteAccountCommand = new DeleteAccountCommand(deleteAccountDto);

    it('execute command handler', async () => {
      jest.spyOn(accountRepository, 'findOneOrFail').mockResolvedValue(accountEntity);
      jest.spyOn(eventPublisher, 'mergeObjectContext').mockImplementation(() => account);
      jest.spyOn(account, 'comparePassword').mockImplementation(() => true);
      jest.spyOn(accountRepository, 'update').mockResolvedValue(accountUpdateResult);
      const result = await deleteAccountCommandHandler.execute(deleteAccountCommand);
      expect(result).toBe(undefined);
    });
  });
});
