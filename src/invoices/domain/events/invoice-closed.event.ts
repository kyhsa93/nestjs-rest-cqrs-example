import { IEvent } from '@nestjs/cqrs';

import { InvoiceProperties } from 'src/invoices/domain/entity/invoice';

export class InvoiceClosedEvent implements IEvent, InvoiceProperties {
  readonly id: string;
  readonly name: string;
  readonly password: string;
  readonly status: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt: Date | null;
  readonly version: number;
}
