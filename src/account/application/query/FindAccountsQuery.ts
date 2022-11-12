import { IQuery } from '@nestjs/cqrs';

export class FindAccountsQuery implements IQuery {
  readonly skip: number;
  readonly take: number;

  constructor(options: FindAccountsQuery) {
    Object.assign(this, options);
  }
}
