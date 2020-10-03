import { Inject } from '@nestjs/common';

import AccountEntity from '@src/account/infrastructure/entity/account';

import Account from '@src/account/domain/model/account.model';
import AccountFactory from '@src/account/domain/model/account.factory';

export default class AccountMapper {
  constructor(@Inject(AccountFactory) private readonly accountFactory: AccountFactory) {}

  public modelToEntity = (model: Account): AccountEntity => {
    const {
      id, email, password, createdAt, updatedAt, deletedAt,
    } = model.toAnemic();
    const entity = new AccountEntity();
    entity.id = id;
    entity.email = email;
    entity.password = password;
    entity.createdAt = createdAt;
    entity.updatedAt = updatedAt;
    entity.deletedAt = deletedAt;
    return entity;
  };

  public entityToModel = (entity: AccountEntity): Account => {
    const {
      id, email, password, createdAt, updatedAt, deletedAt,
    } = entity;
    return this.accountFactory.reconstitute({
      id,
      email,
      password,
      createdAt,
      updatedAt,
      deletedAt,
    });
  };
}
