import Account from '@src/account/domain/model/account';

export default interface AccountRepository {
  newId(): Promise<string>;
  save(account: Account | Account[]): Promise<void>;
  findById(id: string): Promise<Account | undefined>;
  findByEmail(email: string): Promise<Account[]>;
}
