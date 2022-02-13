import { Invoice } from 'src/invoices/domain/entity/invoice';

export class RemittanceOptions {
  readonly password: string;
  readonly invoice: Invoice;
  readonly receiver: Invoice;
  readonly amount: number;
}

export class InvoiceService {
  remit({ invoice, receiver, password, amount }: RemittanceOptions): void {
    invoice.withdraw(amount, password);
    receiver.deposit(amount);
  }
}
