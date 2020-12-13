import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import FindAccountByIdQuery from '@src/account/application/query/implements/find.by.id';
import { Account, Query } from '@src/account/application/query/query';

@QueryHandler(FindAccountByIdQuery)
export default class FindAccountByIdQueryHandler implements IQueryHandler<FindAccountByIdQuery> {
  constructor(
    @Inject('AccountQuery') private readonly accountQuery: Query,
  ) {}

  public async execute(query: FindAccountByIdQuery): Promise<undefined | Account> {
    return this.accountQuery
      .findById(query.id)
      .then(account => !!account ? ({ ...account }) : undefined);
  }
}
