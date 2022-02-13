import { IQuery } from '@nestjs/cqrs';

export class FindInvoiceByIdQuery implements IQuery {
  constructor(readonly id: string) {}
}
