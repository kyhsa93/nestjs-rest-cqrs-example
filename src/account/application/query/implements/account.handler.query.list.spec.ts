import { TestingModule, Test } from "@nestjs/testing";
import { CqrsModule, EventPublisher } from "@nestjs/cqrs";
import { ReadAccountListQueryHandler } from "./account.handler.query.list";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AccountEntity } from "../../../infrastructure/entity/account.entity";
import { Repository } from "typeorm";
import { AccountRepository } from "../../../infrastructure/repository/account.repository";
import { Account } from "../../../domain/model/account.model";
import { ReadAccountListQuery } from "../handlers/account.query.list";
import { ReadAccountListDTO } from "../../../interface/dto/account.dto.read.list";

describe('ReadAccountListQueryHandler', () => {
  let module: TestingModule;
  let readAccountListQueryHandler: ReadAccountListQueryHandler;
  let accountRepository: AccountRepository;
  let eventPublisher: EventPublisher;
  let accountEntity: AccountEntity;
  let account: Account;
  let readAccountListQuery: ReadAccountListQuery;
  let readAccountListDto: ReadAccountListDTO;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ReadAccountListQueryHandler,
        { provide: getRepositoryToken(AccountEntity), useClass: Repository },
      ],
    }).compile();
    readAccountListQueryHandler = module.get(ReadAccountListQueryHandler);
    accountRepository = module.get<Repository<AccountEntity>>(getRepositoryToken(AccountEntity));
    eventPublisher = module.get(EventPublisher);
  });

  afterAll(async () => close());

  describe('execute', () => {
    accountEntity = new AccountEntity();
    account = new Account(accountEntity.accountId, accountEntity.name, accountEntity.email, accountEntity.password, accountEntity.active);
    readAccountListDto = new ReadAccountListDTO('test@test.com', 'password');
    readAccountListQuery = new ReadAccountListQuery(readAccountListDto);
  
    it('execute query handler', async () => {
      jest.spyOn(accountRepository, 'findOneOrFail').mockResolvedValue(accountEntity);
      jest.spyOn(eventPublisher, 'mergeObjectContext').mockImplementation(() => account);
      jest.spyOn(account, 'comparePassword').mockImplementation(() => true);
      const result = await readAccountListQueryHandler.execute(readAccountListQuery);
      expect(result).toHaveProperty('accountId');
      expect(result).toHaveProperty('access');
    });
  });
});
