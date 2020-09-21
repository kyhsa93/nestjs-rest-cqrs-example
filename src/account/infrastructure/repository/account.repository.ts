import { Inject } from '@nestjs/common';
import { EntityRepository, getRepository } from 'typeorm';

import AccountMapper from '@src/account/infrastructure/mapper/account.mapper';
import AccountEntity from '@src/account/infrastructure/entity/account.entity';

import Account from '@src/account/domain/model/account.model';

@EntityRepository(AccountEntity)
export default class AccountRepository {
  constructor(@Inject(AccountMapper) private readonly accountMapper: AccountMapper) {}

  public newId = async (): Promise<string> => {
    const entity = await getRepository(AccountEntity).save(new AccountEntity());
    return entity.id;
  };

  public save = async (data: Account | Account[]): Promise<void> => {
    const models = Array.isArray(data) ? data : [data];
    const entities = models.map((model) => this.accountMapper.modelToEntity(model));
    await getRepository(AccountEntity).save(entities);
  };

  public findById = async (id: string): Promise<Account | undefined> => {
    const entity = await getRepository(AccountEntity).findOne({ id });
    return entity ? this.accountMapper.entityToModel(entity) : undefined;
  };

  public findByEmail = async (email: string): Promise<Account[]> => {
    const entities = await getRepository(AccountEntity).find({ email });
    return entities.map((entity) => this.accountMapper.entityToModel(entity));
  };
}
