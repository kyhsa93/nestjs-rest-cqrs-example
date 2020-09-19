import { Inject } from "@nestjs/common";
import AccountCreated from "src/account/domain/event/account.created";

import Account from "src/account/domain/model/account.model";
import PasswordFactory from "src/account/domain/model/password.factory";

export default class AccountFactory {
  constructor(@Inject(PasswordFactory) private readonly _passwordFactory: PasswordFactory) {}

  public create(id: string, email: string, password: string, ): Account {
    const account =  new Account(id, email, this._passwordFactory.create(password), new Date(), new Date());
    account.apply(new AccountCreated(id, email));
    return account
  }
}
