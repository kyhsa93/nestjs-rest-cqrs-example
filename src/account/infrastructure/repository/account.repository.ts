import { Inject } from '@nestjs/common';
import { EntityRepository, getRepository } from 'typeorm';

import AccountMapper from 'src/account/infrastructure/mapper/account.mapper';
import AccountEntity from '../entity/account.entity';

import Account from 'src/account/domain/model/account.model';


@EntityRepository(AccountEntity)
export default class AccountRepository {
  constructor(@Inject(AccountMapper) private readonly accountMapper: AccountMapper) {}

  public async newId(): Promise<string> {
    return (await getRepository(AccountEntity).save(new AccountEntity)).id
  }

  public async save (data: Account | Account[]): Promise<void> {
    const modelList = Array.isArray(data) ? data : [data];
    const entityList = modelList.map(model => this.accountMapper.modelToEntity(model));
    await getRepository(AccountEntity).save(entityList);
  }

  public async findByEmail(email: string): Promise<Account[]> {
    const entities = await getRepository(AccountEntity).find({email});
    return entities.map(entity => this.accountMapper.entityToModel(entity));
  }
}
