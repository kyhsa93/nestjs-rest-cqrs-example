import { Inject } from '@nestjs/common';

import AccountCreated from '@src/account/domain/event/account.created';
import Account, { AnemicAccount } from '@src/account/domain/model/account';
import PasswordFactory from '@src/account/domain/factory/password';

export default class AccountFactory {
  constructor(@Inject(PasswordFactory) private readonly passwordFactory: PasswordFactory) {}

  public create(id: string, email: string, password: string): Account {
    const account = new Account({
      id,
      email,
      password: this.passwordFactory.create(password),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
    });
    account.apply(new AccountCreated(id, email));
    return account;
  }

  public reconstitute(anemic: AnemicAccount): Account {
    const {
      id, email, createdAt, updatedAt, deletedAt,
    } = anemic;
    const password = this.passwordFactory.reconstitute(anemic.password);
    return new Account({
      id, email, password, createdAt, updatedAt, deletedAt,
    });
  }
}
