import { IQuery } from '@nestjs/cqrs';

export class FindInvoicesQuery implements IQuery {
  constructor(readonly offset: number, readonly limit: number) {}
}
