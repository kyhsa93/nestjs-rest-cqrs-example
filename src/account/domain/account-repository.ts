import { Account } from 'src/account/domain/Account';

export abstract class AccountRepository {
  abstract newId(): Promise<string>;
  abstract save(account: Account | Account[]): Promise<void>;
  abstract findById(id: string): Promise<Account | null>;
  abstract findByName(name: string): Promise<Account[]>;
}
