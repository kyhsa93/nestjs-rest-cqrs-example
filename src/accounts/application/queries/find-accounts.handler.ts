import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { AccountQuery } from "src/accounts/application/queries/account.query";
import { FindAccountsQuery } from "src/accounts/application/queries/find-accounts.query";
import { FindAccountsResult } from "src/accounts/application/queries/find-accounts.result";

@QueryHandler(FindAccountsQuery)
export class FindAccountsHandler implements IQueryHandler<FindAccountsQuery> {

  constructor(
    @Inject('AccountQueryImplement') readonly accountQuery: AccountQuery,
  ) {}

  async execute(query: FindAccountsQuery): Promise<FindAccountsResult> {
    return this.accountQuery.find(query.offset, query.limit);
  }
}