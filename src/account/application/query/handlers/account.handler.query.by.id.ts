import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import AccountEntity from "../../../infrastructure/entity/account.entity";
import RedisAdapter from '../../../infrastructure/redis/redis.adapter';
import AccountQuery from "src/account/infrastructure/query/account.query";

import FindAccountByIdQuery from "../implements/account.query.by.id";

type Account = { id: string, email: string, createdAt: Date, updatedAt: Date };

@QueryHandler(FindAccountByIdQuery)
export class FindAccountByIdQueryHandler implements IQueryHandler<FindAccountByIdQuery> {
  constructor(
    @Inject(AccountQuery) private readonly accountQuery: AccountQuery,
    @Inject(RedisAdapter) private readonly redisAdapter: RedisAdapter,
  ) {}

  public async execute(query: FindAccountByIdQuery): Promise<Account | undefined> {
    const { id } = query;

    const cached = await this.redisAdapter.get(id);
    if (cached) return this.parseCache(cached);

    const entity = await this.accountQuery.findById(id);
    if (!entity) return undefined;

    this.redisAdapter.set(id, JSON.stringify(entity));

    return this.entityToAccount(entity);
  }

  private parseCache(cached: string): Account {
    const entity = JSON.parse(cached) as AccountEntity;
    return this.entityToAccount(entity);
  }

  private entityToAccount(entity: AccountEntity): Account {
    const { id, email, createdAt, updatedAt } = entity;
    return { id, email, createdAt, updatedAt }
  }
}
