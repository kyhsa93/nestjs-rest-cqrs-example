import { FindAccountByIdResult } from 'src/account/application/query/FindAccountByIdResult';
import { FindAccountsQuery } from 'src/account/application/query/FindAccountsQuery';
import { FindAccountsResult } from 'src/account/application/query/FindAccountsResult';

export abstract class AccountQuery {
  abstract findById(id: string): Promise<FindAccountByIdResult | null>;
  abstract find(query: FindAccountsQuery): Promise<FindAccountsResult>;
}
