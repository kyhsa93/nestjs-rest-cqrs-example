import { EntityRepository, Repository } from 'typeorm';
import AccountEntity from '../entity/account.entity';

@EntityRepository(AccountEntity)
export default class AccountRepository extends Repository<AccountEntity> {}
