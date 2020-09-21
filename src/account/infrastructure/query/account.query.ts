import { getRepository } from 'typeorm';

import AccountEntity from '@src/account/infrastructure/entity/account.entity';

export default class AccountQuery {
  public findById = async (id: string): Promise<AccountEntity | undefined> => {
    const repository = getRepository(AccountEntity);
    return repository.findOne({ id });
  };

  public findByEmail = async (email: string): Promise<AccountEntity | undefined> => {
    const repository = getRepository(AccountEntity);
    return repository.findOne({ email });
  };
}
