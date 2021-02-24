import bcrypt from 'bcrypt';

import AccountCreated from '@src/account/domain/event/account.opened';
import Account, { AccountAttributes } from '@src/account/domain/model/account';
import Password from '@src/account/domain/model/password';

export default class AccountFactory {
  private genPasswordSaltSync(): string {
    return bcrypt.genSaltSync();
  }

  private hashPassword(password: string, salt: string): string {
    return bcrypt.hashSync(password, salt);
  }

  public create(id: string, name: string, password: string): Account {
    const salt = this.genPasswordSaltSync()
    const now = new Date();
    const account = new Account({
      id,
      name,
      password: new Password({
        encrypted: this.hashPassword(password, salt),
        salt,
        createdAt: now,
        comparedAt: now,
      }),
      balance: 0,
      openedAt: now,
      updatedAt: now,
      closedAt: undefined,
    });
    account.apply(new AccountCreated(id));
    return account;
  };

  public reconstitute(attributes: AccountAttributes): Account {
    const { id, name, balance, openedAt, updatedAt, closedAt } = attributes;
    const password = new Password({ ...attributes.password });
    return new Account({
      id,
      name,
      password,
      balance,
      openedAt,
      updatedAt,
      closedAt,
    });
  };
}
