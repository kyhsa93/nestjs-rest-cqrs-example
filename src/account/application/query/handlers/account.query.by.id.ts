import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import AccountQuery from '@src/account/infrastructure/query/account';
import AccountEntity from '@src/account/infrastructure/entity/account';
import RedisAdapter from '@src/account/infrastructure/redis/adapter';

import FindAccountByIdQuery from '@src/account/application/query/implements/account.query.by.id';

type Account = { id: string; email: string; createdAt: Date; updatedAt: Date };

function entityToAccount(entity: AccountEntity): Account {
  const {
    id, email, createdAt, updatedAt,
  } = entity;
  return {
    id,
    email,
    createdAt,
    updatedAt,
  };
}

@QueryHandler(FindAccountByIdQuery)
export default class FindAccountByIdQueryHandler implements IQueryHandler<FindAccountByIdQuery> {
  constructor(
    @Inject(AccountQuery) private readonly accountQuery: AccountQuery,
    @Inject(RedisAdapter) private readonly redisAdapter: RedisAdapter,
  ) {}

  public async execute(query: FindAccountByIdQuery): Promise<Account | undefined> {
    const { id } = query;

    const cached = await this.redisAdapter.get(id);
    if (cached) return entityToAccount(JSON.parse(cached) as AccountEntity);

    const entity = await this.accountQuery.findById(id);
    if (!entity) return undefined;

    this.redisAdapter.set(id, JSON.stringify(entity));

    return entityToAccount(entity);
  }
}
