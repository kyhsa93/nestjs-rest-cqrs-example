import { Invoice } from 'src/invoices/domain/entity/invoice';

export interface InvoiceRepository {
  newId: () => Promise<string>;
  save: (invoice: Invoice | Invoice[]) => Promise<void>;
  findById: (id: string) => Promise<Invoice | null>;
  findByIds: (ids: string[]) => Promise<Invoice[]>;
  findByName: (name: string) => Promise<Invoice[]>;
}
