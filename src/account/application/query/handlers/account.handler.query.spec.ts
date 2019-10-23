import { TestingModule, Test } from '@nestjs/testing'
import { CqrsModule } from '@nestjs/cqrs';
import { ReadAccountQueryHandler } from './account.handler.query';
import { getRepositoryToken } from '@nestjs/typeorm';
import AccountEntity from '../../../infrastructure/entity/account.entity';
import { Repository } from 'typeorm';
import AccountRepository from '../../../infrastructure/repository/account.repository';
import { ReadAccountQuery } from '../implements/account.query';
import ReadAccountDTO from '../../../interface/dto/account.dto.read';

jest.mock('../../../infrastructure/redis/account.redis');

describe('ReadAccountQueryHandler', () => {
  let module: TestingModule;
  let readAccountQueryHandler: ReadAccountQueryHandler;
  let accountRepository: AccountRepository;
  let accountEntity: AccountEntity;
  let readAccountQuery: ReadAccountQuery;
  let readAccountDto: ReadAccountDTO;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ReadAccountQueryHandler,
        { provide: getRepositoryToken(AccountEntity), useClass: Repository },
      ],
    }).compile();
    readAccountQueryHandler = module.get(ReadAccountQueryHandler);
    accountRepository = module.get<Repository<AccountEntity>>(getRepositoryToken(AccountEntity));
  });

  afterAll(async () => close());

  describe('execute', () => {
    accountRepository = new AccountRepository();
    accountEntity = new AccountEntity();
    readAccountDto = new ReadAccountDTO('accountId');
    readAccountQuery = new ReadAccountQuery(readAccountDto);

    it('execute query handler', async () => {
      jest.spyOn(accountRepository, 'findOne').mockResolvedValue(accountEntity);
      const result = await readAccountQueryHandler.execute(readAccountQuery);
      expect(result).toBeDefined();
    });
  });
});
