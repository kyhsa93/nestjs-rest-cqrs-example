import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from '@nestjs/typeorm';
import { ReadAccountQuery } from "../implements/account.query";
import AccountEntity from "../../../infrastructure/entity/account.entity";
import AccountRepository from "../../../infrastructure/repository/account.repository";
import ReadAccountMapper from "../../../infrastructure/mapper/account.mapper.read";
import AccountRedis from '../../../infrastructure/redis/account.redis';
import { IsNull } from "typeorm";

@QueryHandler(ReadAccountQuery)
export class ReadAccountQueryHandler implements IQueryHandler<ReadAccountQuery> {
  constructor(
    @InjectRepository(AccountEntity) private readonly repository: AccountRepository,
  ) {}

  async execute(query: ReadAccountQuery): Promise<AccountEntity | undefined> {
    const redis = new AccountRedis();
    const cached = await redis.get(`account:${query.accountId}`);
    if (cached) return JSON.parse(cached);

    const account = await this.repository.findOne({ ...new ReadAccountMapper(query.accountId), deletedAt: IsNull() });
    if (!account) return undefined;

    redis.set(`account:${query.accountId}`, JSON.stringify(account));
    return account;
  }
}
