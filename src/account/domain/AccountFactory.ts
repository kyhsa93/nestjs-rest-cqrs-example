import {
  Account,
  AccountImplement,
  AccountProperties,
} from 'src/account/domain/Account';

type CreateAccountOptions = Readonly<{
  id: string;
  name: string;
  email: string;
  password: string;
}>;

export class AccountFactory {
  create(options: CreateAccountOptions): Account {
    return new AccountImplement({
      ...options,
      balance: 0,
      lockedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      version: 0,
    });
  }

  reconstitute(properties: AccountProperties): Account {
    return new AccountImplement(properties);
  }
}
