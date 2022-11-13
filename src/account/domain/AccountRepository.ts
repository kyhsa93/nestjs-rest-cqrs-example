import { Account } from 'src/account/domain/Account';

export interface AccountRepository {
  newId: () => Promise<string>;
  save: (account: Account | Account[]) => Promise<void>;
  findById: (id: string) => Promise<Account | null>;
  findByName: (name: string) => Promise<Account[]>;
}
