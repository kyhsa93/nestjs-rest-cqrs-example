import { AccountEntity } from '../entity/account.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {}
