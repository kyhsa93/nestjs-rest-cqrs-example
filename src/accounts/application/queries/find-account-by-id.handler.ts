import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectionToken } from 'src/accounts/application/injection.token';
import { AccountQuery } from 'src/accounts/application/queries/account.query';
import { FindAccountByIdQuery } from 'src/accounts/application/queries/find-account-by-id.query';
import { FindAccountByIdResult } from 'src/accounts/application/queries/find-account-by-id.result';

import { ErrorMessage } from 'src/accounts/domain/error';

@QueryHandler(FindAccountByIdQuery)
export class FindAccountByIdHandler
  implements IQueryHandler<FindAccountByIdQuery, FindAccountByIdResult>
{
  constructor(
    @Inject(InjectionToken.ACCOUNT_QUERY) readonly accountQuery: AccountQuery,
  ) {}

  async execute(query: FindAccountByIdQuery): Promise<FindAccountByIdResult> {
    const data = await this.accountQuery.findById(query.id);
    if (!data) throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    const dataKeys = Object.keys(data);
    const resultKeys = Object.keys(new FindAccountByIdResult());

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
