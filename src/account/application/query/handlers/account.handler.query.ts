import { IQueryHandler, QueryHandler, EventPublisher } from "@nestjs/cqrs";
import { InjectRepository } from '@nestjs/typeorm';
import { ReadAccountQuery } from "../implements/account.query";
import AccountEntity from "../../../infrastructure/entity/account.entity";
import AccountRepository from "../../../infrastructure/repository/account.repository";
import ReadAccountMapper from "../../../infrastructure/mapper/account.mapper.read";
import AccountRedis from '../../../infrastructure/redis/account.redis';
import { IsNull } from "typeorm";
import Account from "../../../domain/model/account.model";

@QueryHandler(ReadAccountQuery)
export class ReadAccountQueryHandler implements IQueryHandler<ReadAccountQuery> {
  constructor(
    @InjectRepository(AccountEntity) private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  private parseCache(cached: string): Account {
    const data: AccountEntity = JSON.parse(cached);
    return new Account(data.accountId, data.name, data.email, data.password, data.active);
  }

  async execute(query: ReadAccountQuery): Promise<Account | undefined> {
    const redis = new AccountRedis();
    const cached = await redis.get(`account:${query.accountId}`);
    if (cached) return this.parseCache(cached);

    const result = await this.repository.findOne({ ...new ReadAccountMapper(query.accountId), deletedAt: IsNull() });
    if (!result) return undefined;

    redis.set(`account:${query.accountId}`, JSON.stringify(result));

    const account = new Account(result.accountId, result.name, result.email, result.password, result.active)
    return this.publisher.mergeObjectContext(account);
  }
}
