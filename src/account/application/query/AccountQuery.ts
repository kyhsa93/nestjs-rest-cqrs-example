import { FindAccountByIdResult } from 'src/account/application/query/FindAccountByIdResult';
import { FindAccountsQuery } from 'src/account/application/query/FindAccountsQuery';
import { FindAccountsResult } from 'src/account/application/query/FindAccountsResult';

export interface AccountQuery {
  findById: (id: string) => Promise<FindAccountByIdResult | null>;
  find: (query: FindAccountsQuery) => Promise<FindAccountsResult>;
}
