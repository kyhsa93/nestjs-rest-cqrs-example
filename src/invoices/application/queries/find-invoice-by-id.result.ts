import { IQueryResult } from '@nestjs/cqrs';

export class FindInvoiceByIdResult implements IQueryResult {
  readonly id: string = '';
  readonly name: string = '';
  readonly status: number = 0;
  readonly openedAt: Date = new Date();
  readonly updatedAt: Date = new Date();
  readonly closedAt: Date | null = null;
}
