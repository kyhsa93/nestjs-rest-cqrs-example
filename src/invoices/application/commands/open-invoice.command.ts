import { ICommand } from '@nestjs/cqrs';

export class OpenInvoiceCommand implements ICommand {
  constructor(readonly name: string, readonly password: string) {}
}
