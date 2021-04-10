import Account from "src/accounts/domain/account";

export default interface AccountRepository {
  newId: () => Promise<string>;
  save: (account: Account | Account[]) => Promise<void>;
  findById: (id: string) => Promise<Account | undefined>;
  findByName: (name: string) => Promise<Account[]>;
}
