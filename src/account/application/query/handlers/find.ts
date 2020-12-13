import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import FindAccountsQuery from "@src/account/application/query/implements/find";
import { AccountsAndCount, Query } from "@src/account/application/query/query";

@QueryHandler(FindAccountsQuery)
export default class FindAccountsQueryHandler implements IQueryHandler<FindAccountsQuery> {
  constructor(@Inject('AccountQuery') private readonly accountQuery: Query ){}

  public async execute(query: FindAccountsQuery): Promise<AccountsAndCount> {
    return this.accountQuery.findAndCount(query);
  }
}
