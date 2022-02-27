import { Inject, InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectionToken } from 'src/account/application/injection.token';
import {
  AccountQuery,
  ItemInAccounts,
} from 'src/account/application/queries/account.query';
import { FindAccountsQuery } from 'src/account/application/queries/find-accounts.query';
import {
  FindAccountsResult,
  ItemInFindAccountsResult,
} from 'src/account/application/queries/find-accounts.result';

@QueryHandler(FindAccountsQuery)
export class FindAccountsHandler
  implements IQueryHandler<FindAccountsQuery, FindAccountsResult>
{
  constructor(
    @Inject(InjectionToken.ACCOUNT_QUERY) readonly accountQuery: AccountQuery,
  ) {}

  async execute(query: FindAccountsQuery): Promise<FindAccountsResult> {
    return (await this.accountQuery.find(query.offset, query.limit)).map(
      this.filterResultProperties,
    );
  }

  private filterResultProperties(
    data: ItemInAccounts,
  ): ItemInFindAccountsResult {
    const dataKeys = Object.keys(data);
    const resultKeys = Object.keys(new ItemInFindAccountsResult());

    if (dataKeys.length < resultKeys.length)
      throw new InternalServerErrorException();

    if (resultKeys.find((resultKey) => !dataKeys.includes(resultKey)))
      throw new InternalServerErrorException();

    dataKeys
      .filter((dataKey) => !resultKeys.includes(dataKey))
      .forEach((dataKey) => delete data[dataKey]);

    return data;
  }
}
