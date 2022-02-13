import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { OpenInvoiceCommand } from 'src/invoices/application/commands/open-invoice.command';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { InvoiceFactory } from 'src/invoices/domain/factory';
import { InvoiceRepository } from 'src/invoices/domain/repository/repository';

@CommandHandler(OpenInvoiceCommand)
export class OpenInvoiceHandler
  implements ICommandHandler<OpenInvoiceCommand, void>
{
  constructor(
    @Inject(InjectionToken.INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceFactory: InvoiceFactory,
  ) {}

  async execute(command: OpenInvoiceCommand): Promise<void> {
    const invoice = this.invoiceFactory.create(
      await this.invoiceRepository.newId(),
      command.name,
    );

    invoice.open(command.password);

    await this.invoiceRepository.save(invoice);

    invoice.commit();
  }
}
