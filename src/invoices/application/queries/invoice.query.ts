export class Invoice {
  readonly id: string;
  readonly name: string;
  readonly password: string;
  readonly status: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt: Date | null;
}

export class ItemInInvoices {
  readonly id: string;
  readonly name: string;
  readonly password: string;
  readonly status: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt: Date | null;
}

export class Invoices extends Array<ItemInInvoices> {}

export interface InvoiceQuery {
  findById: (id: string) => Promise<Invoice>;
  find: (offset: number, limit: number) => Promise<Invoices>;
}
