import bcrypt from 'bcrypt';

import AccountCreated from '@src/account/domain/event/account.created';
import Account, { AnemicAccount } from '@src/account/domain/model/account';
import Password from '@src/account/domain/model/password';

export default class AccountFactory {
  public create = (id: string, email: string, password: string): Account => {
    const salt = bcrypt.genSaltSync();
    const now = new Date();
    const account = new Account({
      id,
      email,
      password: new Password({
        encrypted: bcrypt.hashSync(password, salt),
        salt,
        createdAt: now,
        comparedAt: now,
      }),
      createdAt: now,
      updatedAt: now,
      deletedAt: undefined,
    });
    account.apply(new AccountCreated(id, email));
    return account;
  };

  public reconstitute = (anemic: AnemicAccount): Account => {
    const { id, email, createdAt, updatedAt, deletedAt } = anemic;
    const password = new Password({ ...anemic.password });
    return new Account({
      id,
      email,
      password,
      createdAt,
      updatedAt,
      deletedAt,
    });
  };
}
