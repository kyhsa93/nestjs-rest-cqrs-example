import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccountQuery } from 'src/accounts/application/queries/account.query';
import { FindAccountByIdQuery } from 'src/accounts/application/queries/find-account-by-id.query';
import { FindAccountByIdResult } from 'src/accounts/application/queries/find-account-by-id.result';

@QueryHandler(FindAccountByIdQuery)
export class FindAccountByIdHandler
  implements IQueryHandler<FindAccountByIdQuery> {
  constructor(
    @Inject('AccountQueryImplement') readonly accountQuery: AccountQuery,
  ) {}

  async execute(query: FindAccountByIdQuery): Promise<FindAccountByIdResult> {
    return { ...(await this.accountQuery.findById(query.id)) };
  }
}
