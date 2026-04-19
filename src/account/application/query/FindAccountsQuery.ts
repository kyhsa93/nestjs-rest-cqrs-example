import { IQuery } from '@nestjs/cqrs';

export class FindAccountsQuery implements IQuery {
  readonly page: number;
  readonly take: number;

  constructor(options: FindAccountsQuery) {
    Object.assign(this, options);
  }
}
