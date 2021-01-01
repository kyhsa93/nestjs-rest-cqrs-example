import { FindConditions, FindManyOptions, getRepository, In } from 'typeorm';
import { Injectable } from '@nestjs/common';

import AccountEntity from '@src/account/infrastructure/entity/account';

import { 
  Account, AccountFindConditions, Accounts, AccountsAndCount, AccountWhereConditions, Query 
} from '@src/account/application/query/query';

@Injectable()
export default class AccountQuery implements Query {
  private convertAccountFromEntity = (entity?: AccountEntity): undefined | Account => {
    return entity ? { ...entity } : undefined;
  }

  public async findById(id: string): Promise<undefined | Account> {
    return this.convertAccountFromEntity(await getRepository(AccountEntity).findOne(id));
  };

  private convertAccountsFromEntities = (entities: AccountEntity[]): Accounts => {
    return entities.map(entity => ({ ...entity }));
  }

  private convertAccountsAndCount([entities, count]: [AccountEntity[], number]): AccountsAndCount {
    return { data: this.convertAccountsFromEntities(entities), count };
  }

  private convertWhereConditions(conditions: AccountWhereConditions): undefined | FindConditions<AccountEntity> {
    let result = {};
    conditions.emails.length === 0 ? undefined : Object.assign(result, { email: In(conditions.emails) });
    return Object.keys(result).length === 0 ? undefined : result;
  }

  private convertFindConditions({ take, page, where }: AccountFindConditions): FindManyOptions<AccountEntity> {
    return { skip: take * (page - 1), take, where: where ? this.convertWhereConditions(where) : undefined };
  }

  public async findAndCount(conditions: AccountFindConditions): Promise<AccountsAndCount> {
    return getRepository(AccountEntity)
      .findAndCount(this.convertFindConditions(conditions))
      .then(entitiesAndCount => this.convertAccountsAndCount(entitiesAndCount));
  }
}
