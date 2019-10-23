import { IQueryHandler, QueryHandler, EventPublisher } from '@nestjs/cqrs';
import { ReadAccountListQuery } from '../implements/account.query.list';
import AccountRepository from '../../../infrastructure/repository/account.repository';
import AccountEntity from '../../../infrastructure/entity/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import Account from '../../../domain/model/account.model';
import * as jwt from 'jsonwebtoken';
import AppConfiguration from '../../../../app.config';
import { IsNull } from 'typeorm';
import AccountRedis from '../../../infrastructure/redis/account.redis';

const { JWT_SECRET, JWT_EXPIRATION } = AppConfiguration

@QueryHandler(ReadAccountListQuery)
export class ReadAccountListQueryHandler implements IQueryHandler<ReadAccountListQuery> {
  constructor(
    @InjectRepository(AccountEntity) private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  private validation(data: Account, password: string): { access: string, accountId: string } {
    const account = this.publisher.mergeObjectContext(new Account(data.accountId, data.name, data.email, data.password, data.active));
    if (!account.comparePassword(password)) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    account.commit();
    return {
      accountId: account.accountId,
      access: jwt.sign({ accountId: account.accountId, email: account.email, name: account.name }, JWT_SECRET, { expiresIn: JWT_EXPIRATION }),
    };
  }

  async execute(query: ReadAccountListQuery): Promise<{ access: string, accountId: string }> {
    const redis = new AccountRedis();
    const cached = await redis.get(`account:${query.email}`);
    if (cached) return this.validation(JSON.parse(cached), query.password);

    const data = await this.repository.findOneOrFail({ email: query.email, deletedAt: IsNull() }).catch(() => {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    });
    const account = this.publisher.mergeObjectContext(new Account(data.accountId, data.name, data.email, data.password, data.active));
    redis.set(`account:${query.email}`, JSON.stringify(account));
    return this.validation(account, query.password);
  }
}
