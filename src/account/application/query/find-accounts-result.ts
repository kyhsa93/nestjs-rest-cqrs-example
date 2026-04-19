import { IQueryResult } from '@nestjs/cqrs';

export class FindAccountsResult implements IQueryResult {
  constructor(
    readonly accounts: Readonly<{
      id: string;
      name: string;
      balance: number;
    }>[],
  ) {}
}
