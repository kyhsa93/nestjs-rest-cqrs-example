import { Test, TestingModule } from '@nestjs/testing';
import uuid from 'uuid';
import { CreateAccountCommandHandler } from './account.handler.command.create';
import { CreateAccountCommand } from '../implements/account.command.create';
import AccountRepository from '../../../infrastructure/repository/account.repository';
import { EventPublisher, CqrsModule } from '@nestjs/cqrs';
import Account from '../../../domain/model/account.model';
import AccountEntity from '../../../infrastructure/entity/account.entity';
import CreateAccountDTO from '../../../interface/dto/account.dto.create';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CreateAccountCommandHandler', () => {
  let module: TestingModule;
  let accountRepository: AccountRepository;
  let accountEntity: AccountEntity;
  let eventPublisher: EventPublisher;
  let account: Account;
  let createAccountDto: CreateAccountDTO;
  let createAccountCommand: CreateAccountCommand;
  let createAccountCommandHandler: CreateAccountCommandHandler;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        CreateAccountCommandHandler,
        { provide: getRepositoryToken(AccountEntity), useClass: Repository },
      ],
    }).compile();

    createAccountCommandHandler = module.get(CreateAccountCommandHandler);
    accountRepository = module.get<Repository<AccountEntity>>(getRepositoryToken(AccountEntity));
    eventPublisher = module.get(EventPublisher);
  });

  afterAll(async () => close());

  describe('execute', () => {
    accountEntity = new AccountEntity();
    account = new Account(accountEntity.accountId, accountEntity.name, accountEntity.email, accountEntity.password, accountEntity.active);
    createAccountDto = new CreateAccountDTO(accountEntity.email, accountEntity.password, accountEntity.name);
    createAccountCommand = new CreateAccountCommand(createAccountDto);

    it('execute command handler', async () => {
      jest.spyOn(uuid, 'v4').mockImplementation(() => 'uuidv4');
      jest.spyOn(accountRepository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(eventPublisher, 'mergeObjectContext').mockImplementation(() => account);
      jest.spyOn(accountRepository, 'save').mockResolvedValue(accountEntity);
      const result = await createAccountCommandHandler.execute(createAccountCommand);
      expect(result).toBe(undefined);
    });
  });
});
