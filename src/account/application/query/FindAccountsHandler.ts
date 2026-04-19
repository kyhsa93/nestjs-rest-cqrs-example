import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AccountQuery } from 'src/account/application/query/AccountQuery';
import { FindAccountsQuery } from 'src/account/application/query/FindAccountsQuery';
import { FindAccountsResult } from 'src/account/application/query/FindAccountsResult';

@QueryHandler(FindAccountsQuery)
export class FindAccountsHandler implements IQueryHandler<
  FindAccountsQuery,
  FindAccountsResult
> {
  constructor(private readonly accountQuery: AccountQuery) {}

  async execute(query: FindAccountsQuery): Promise<FindAccountsResult> {
    return this.accountQuery.find(query);
  }
}
