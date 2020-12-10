import { getRepository, In } from 'typeorm';

import AccountEntity from '@src/account/infrastructure/entity/account';

import { Account, Accounts, Query } from '@src/account/application/query/query';

type QueryResult = Promise<undefined | Account | Accounts>;

export default class AccountQuery implements Query {
  public findById = async (id: string | string[]): QueryResult => {
    return Array.isArray(id)
      ? this.convertAccountsFromEntities(await getRepository(AccountEntity).findByIds(id))
      : this.convertAccountFromEntity(await getRepository(AccountEntity).findOne(id));
  };

  public findByEmail = async (email: string | string[]): QueryResult => {
    return Array.isArray(email)
      ? this.convertAccountsFromEntities(await getRepository(AccountEntity).find({ email: In(email) }))
      : this.convertAccountFromEntity(await getRepository(AccountEntity).findOne({ email }));
  };

  private convertAccountFromEntity = (entity: AccountEntity | undefined): Account | undefined => {
    return entity ? { ...entity } : undefined;
  }

  private convertAccountsFromEntities = (entities: AccountEntity[]): Accounts => {
    return entities.map((entity) => ({ ...entity }));
  }
}
