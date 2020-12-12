import { getRepository, In } from 'typeorm';

import AccountEntity from '@src/account/infrastructure/entity/account';

import { Account, Accounts, Query } from '@src/account/application/query/query';

export default class AccountQuery implements Query {
  public findById = async (id: string): Promise<undefined | Account> => {
    return this.convertAccountFromEntity(await getRepository(AccountEntity).findOne(id));
  };

  public findByIds = async (id: string[]): Promise<Accounts> => {
    return this.convertAccountsFromEntities(await getRepository(AccountEntity).findByIds(id));
  }

  public findByEmail = async (email: string | string[]): Promise<Accounts> => {
    const condition = Array.isArray(email) ? email : [email];
    return this.convertAccountsFromEntities(await getRepository(AccountEntity).find({ email: In(condition) }));
  };

  private convertAccountFromEntity = (entity: AccountEntity | undefined): Account | undefined => {
    return entity ? { ...entity } : undefined;
  }

  private convertAccountsFromEntities = (entities: AccountEntity[]): Accounts => {
    return entities.map((entity) => ({ ...entity }));
  }
}
