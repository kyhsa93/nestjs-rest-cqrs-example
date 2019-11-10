import { IQueryHandler, QueryHandler, EventPublisher } from "@nestjs/cqrs";
import { InjectRepository } from '@nestjs/typeorm';
import { ReadAccountQuery } from "../implements/account.query";
import AccountEntity from "../../../infrastructure/entity/account.entity";
import AccountRepository from "../../../infrastructure/repository/account.repository";
import ReadAccountMapper from "../../../infrastructure/mapper/account.mapper.read";
import AccountRedis from '../../../infrastructure/redis/account.redis';
import { IsNull } from "typeorm";
import Account from "../../../domain/model/account.model";

type Response = { id: string, name: string, email: string, active: boolean };

@QueryHandler(ReadAccountQuery)
export class ReadAccountQueryHandler implements IQueryHandler<ReadAccountQuery> {
  constructor(
    @InjectRepository(AccountEntity) private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  private parseCache(cached: string): Response {
    const data: AccountEntity = JSON.parse(cached);
    const account = new Account(data.id, data.name, data.email, data.password, data.active);
    this.publisher.mergeObjectContext(account);
    const { id, name, email, active } = account;
    return { id, name, email, active };
  }

  async execute(query: ReadAccountQuery): Promise<Response | undefined> {
    const redis = new AccountRedis();
    const cached = await redis.get(`account:${query.id}`);
    if (cached) return this.parseCache(cached);

    const result = await this.repository.findOne({ ...new ReadAccountMapper(query.id), deletedAt: IsNull() });
    if (!result) return undefined;

    redis.set(`account:${query.id}`, JSON.stringify(result));

    const account = new Account(result.id, result.name, result.email, result.password, result.active)
    this.publisher.mergeObjectContext(account);

    const { id, name, email, active } = account;
    return { id, name, email, active };
  }
}
