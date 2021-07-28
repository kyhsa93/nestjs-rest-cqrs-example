import { Inject, InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
  AccountQuery,
  ItemInAccounts,
} from 'src/accounts/application/queries/account.query';
import { FindAccountsQuery } from 'src/accounts/application/queries/find-accounts.query';
import {
  FindAccountsResult,
  ItemInFindAccountsResult,
} from 'src/accounts/application/queries/find-accounts.result';

@QueryHandler(FindAccountsQuery)
export class FindAccountsHandler
  implements IQueryHandler<FindAccountsQuery, FindAccountsResult>
{
  constructor(
    @Inject('AccountQueryImplement') readonly accountQuery: AccountQuery,
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
