import { IQueryResult } from '@nestjs/cqrs';

export class FindAccountByIdResult implements IQueryResult {
  readonly id: string;
  readonly name: string;
  readonly balance: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
}
