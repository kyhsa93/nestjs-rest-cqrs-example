import { FindAccountByIdResult } from 'src/account/application/query/find-account-by-id-result';
import { FindAccountsQuery } from 'src/account/application/query/find-accounts-query';
import { FindAccountsResult } from 'src/account/application/query/find-accounts-result';

export abstract class AccountQuery {
  abstract findById(id: string): Promise<FindAccountByIdResult | null>;
  abstract find(query: FindAccountsQuery): Promise<FindAccountsResult>;
}
