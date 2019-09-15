import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from '@nestjs/typeorm';
import { ReadAccountQuery } from "./account.query";
import { AccountEntity } from "../entity/account.entity";
import { AccountRepository } from "../repository/account.repository";
import { ReadAccountMapper } from "../mapper/account.mapper.read";

@QueryHandler(ReadAccountQuery)
export class ReadAccountQueryHandler implements IQueryHandler<ReadAccountQuery> {
  constructor(
    @InjectRepository(AccountEntity) private readonly repository: AccountRepository,
  ) {}

  async execute(query: ReadAccountQuery): Promise<AccountEntity | undefined> {
    return this.repository.findOne(new ReadAccountMapper(query.accountId));
  }
}
