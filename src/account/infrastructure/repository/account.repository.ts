import { Inject } from '@nestjs/common';
import { EntityRepository, getRepository, Repository } from 'typeorm';

import AccountMapper from 'src/account/infrastructure/mapper/account.mapper';
import AccountEntity from '../entity/account.entity';

import Account from 'src/account/domain/model/account.model';


@EntityRepository(AccountEntity)
export default class AccountRepository extends Repository<AccountEntity> {
  constructor(@Inject(AccountMapper) private readonly accountMapper: AccountMapper) {
    super();
  }

  public readonly save = async (data: Account | Account[]): Promise<AccountEntity[]> => {
    const modelList = Array.isArray(data) ? data : [data];
    const entityList = modelList.map(model => this.accountMapper.modelToEntity(model));
    return getRepository(AccountEntity).save(entityList);
  }
}
