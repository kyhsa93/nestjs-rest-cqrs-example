import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import {
  Invoice,
  InvoiceImplement,
  InvoiceProperties,
} from 'src/invoices/domain/entity/invoice';

export class InvoiceFactory {
  constructor(
    @Inject(EventPublisher) private readonly eventPublisher: EventPublisher,
  ) {}

  create(id: string, name: string): Invoice {
    return this.eventPublisher.mergeObjectContext(
      new InvoiceImplement({ id, name }),
    );
  }

  reconstitute(properties: InvoiceProperties): Invoice {
    return this.eventPublisher.mergeObjectContext(
      new InvoiceImplement(properties),
    );
  }
}
