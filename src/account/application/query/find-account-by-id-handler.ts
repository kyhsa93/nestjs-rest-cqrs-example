import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { throwError } from 'libs/error/throw-error';

import { AccountQuery } from 'src/account/application/query/account-query';
import { FindAccountByIdQuery } from 'src/account/application/query/find-account-by-id-query';
import { FindAccountByIdResult } from 'src/account/application/query/find-account-by-id-result';

import { ErrorMessage } from 'src/account/domain/error-message';

@QueryHandler(FindAccountByIdQuery)
export class FindAccountByIdHandler implements IQueryHandler<
  FindAccountByIdQuery,
  FindAccountByIdResult
> {
  constructor(private readonly accountQuery: AccountQuery) {}

  async execute(query: FindAccountByIdQuery): Promise<FindAccountByIdResult> {
    const data = await this.accountQuery.findById(query.id);
    if (!data) throwError(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    const dataKeys = Object.keys(data);
    const resultKeys = Object.keys(new FindAccountByIdResult());

    if (dataKeys.length < resultKeys.length)
      throwError(ErrorMessage.INTERNAL_SERVER_ERROR);

    if (resultKeys.find((resultKey) => !dataKeys.includes(resultKey)))
      throwError(ErrorMessage.INTERNAL_SERVER_ERROR);

    dataKeys
      .filter((dataKey) => !resultKeys.includes(dataKey))
      .forEach(
        (dataKey) =>
          delete (data as unknown as Record<string, unknown>)[dataKey],
      );

    return data;
  }
}
