import { IQuery } from '@nestjs/cqrs';

export class FindAccountsQuery implements IQuery {
  constructor(readonly offset: number, readonly limit: number) {}
}
