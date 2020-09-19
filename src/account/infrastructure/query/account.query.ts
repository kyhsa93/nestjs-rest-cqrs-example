import { getRepository } from "typeorm";

import AccountEntity from "src/account/infrastructure/entity/account.entity";

export default class AccountQuery {
  public async findById(id: string): Promise<AccountEntity | undefined> {
    return getRepository(AccountEntity).findOne({ id });
  }

  public async findByEmail(email: string): Promise<AccountEntity | undefined> {
    return getRepository(AccountEntity).findOne({ email });
  }
}
