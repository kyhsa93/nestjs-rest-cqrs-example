import { Inject } from "@nestjs/common";

import AccountEntity from "src/account/infrastructure/entity/account.entity";

import Account from "src/account/domain/model/account.model";
import AccountFactory from "src/account/domain/model/account.factory";

export default class AccountMapper {
  constructor(@Inject(AccountFactory) private readonly accountFactory: AccountFactory) {}

  public modelToEntity(model: Account): AccountEntity {
    const entity = new AccountEntity();
    entity.id = model.id;
    entity.email = model.email;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    return entity;
  }

  public entityToModel(entity: AccountEntity): Account {
    const { id, email, password, active, createdAt, updatedAt } = entity;
    const passwordData = { encrypted: password.encrypted, salt: password.salt, createdAt: password.createdAt, comparedAt: password.comparedAt };
    return this.accountFactory.reconstitue(id, email, passwordData, createdAt, updatedAt);
  }
}