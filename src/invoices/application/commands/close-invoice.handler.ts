import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CloseInvoiceCommand } from 'src/invoices/application/commands/close-invoice.command';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { ErrorMessage } from 'src/invoices/domain/error/error';
import { InvoiceRepository } from 'src/invoices/domain/repository/repository';

@CommandHandler(CloseInvoiceCommand)
export class CloseInvoiceHandler
  implements ICommandHandler<CloseInvoiceCommand, void>
{
  constructor(
    @Inject(InjectionToken.INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(command: CloseInvoiceCommand): Promise<void> {
    const invoice = await this.invoiceRepository.findById(command.id);
    if (!invoice)
      throw new NotFoundException(ErrorMessage.INVOICE_IS_NOT_FOUND);

    invoice.close(command.password);

    await this.invoiceRepository.save(invoice);

    invoice.commit();
  }
}
