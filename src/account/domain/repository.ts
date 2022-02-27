import { Account } from 'src/account/domain/account';

export interface AccountRepository {
  newId: () => Promise<string>;
  save: (account: Account | Account[]) => Promise<void>;
  findById: (id: string) => Promise<Account | null>;
  findByIds: (ids: string[]) => Promise<Account[]>;
  findByName: (name: string) => Promise<Account[]>;
}
