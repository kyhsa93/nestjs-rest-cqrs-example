import { getRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Account as AccountEntity } from 'src/accounts/infrastructure/entity/account';
import {
  Account,
  AccountQuery,
  Accounts,
} from 'src/accounts/application/queries/account.query';

@Injectable()
export default class AccountQueryImplement implements AccountQuery {
  private convertAccountFromEntity(
    entity?: AccountEntity,
  ): undefined | Account {
    return entity ? { ...entity } : undefined;
  }

  public async findById(id: string): Promise<undefined | Account> {
    return this.convertAccountFromEntity(
      await getRepository(AccountEntity).findOne(id),
    );
  }

  public async find(offset: number, limit: number): Promise<Accounts> {
    return this.convertAccountsFromEntities(
      await getRepository(AccountEntity).find({ skip: offset, take: limit }),
    );
  }

  private convertAccountsFromEntities(entities: AccountEntity[]): Accounts {
    return entities.map((entity) => ({ ...entity }));
  }
}
