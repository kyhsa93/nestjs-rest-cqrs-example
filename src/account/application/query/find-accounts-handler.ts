import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AccountQuery } from 'src/account/application/query/account-query';
import { FindAccountsQuery } from 'src/account/application/query/find-accounts-query';
import { FindAccountsResult } from 'src/account/application/query/find-accounts-result';

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
