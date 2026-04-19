import { Account } from 'src/account/domain/account';

export type FindAccountsOptions = Readonly<{
  id?: string;
  take: number;
  page: number;
}>;

export type FindAccountsRepositoryResult = Readonly<{
  accounts: Account[];
}>;

export abstract class AccountRepository {
  abstract newId(): Promise<string>;
  abstract save(account: Account | Account[]): Promise<void>;
  abstract findAccounts(
    options: FindAccountsOptions,
  ): Promise<FindAccountsRepositoryResult>;
}
