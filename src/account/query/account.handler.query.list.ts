import { IQueryHandler, QueryHandler, EventPublisher } from '@nestjs/cqrs';
import { ReadAccountListQuery } from './account.query.list';
import { AccountRepository } from '../repository/account.repository';
import { AccountEntity } from '../entity/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Account } from '../model/account.model';
import * as jwt from 'jsonwebtoken';
import { AppConfiguration } from '../../app.config';

const { JWT_SECRET, JWT_EXPIRATION } = AppConfiguration

@QueryHandler(ReadAccountListQuery)
export class ReadAccountListQueryHandler implements IQueryHandler<ReadAccountListQuery> {
  constructor(
    @InjectRepository(AccountEntity) private readonly repository: AccountRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(query: ReadAccountListQuery): Promise<{access: string}> {
    const data = await this.repository.findOneOrFail({ email: query.email }).catch(() => {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    });
    const account = this.publisher.mergeObjectContext(new Account(data.account_id, data.name, data.email, data.password, data.active));
    if (!account.comparePassword(query.password)) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    account.commit();
    return {
      access: jwt.sign({ accountId: account.accountId, email: account.email, name: account.name }, JWT_SECRET, { expiresIn: JWT_EXPIRATION }),
    };
  }
}
