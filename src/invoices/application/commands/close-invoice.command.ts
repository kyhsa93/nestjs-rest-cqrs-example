import { ICommand } from '@nestjs/cqrs';

export class CloseInvoiceCommand implements ICommand {
  constructor(readonly id: string, readonly password: string) {}
}
