import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DepositCommand } from 'src/invoices/application/commands/deposit.command';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { ErrorMessage } from 'src/invoices/domain/error/error';
import { InvoiceRepository } from 'src/invoices/domain/repository/repository';

@CommandHandler(DepositCommand)
export class DepositHandler implements ICommandHandler<DepositCommand, void> {
  constructor(
    @Inject(InjectionToken.INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(command: DepositCommand): Promise<void> {
    const invoice = await this.invoiceRepository.findById(command.id);
    if (!invoice)
      throw new NotFoundException(ErrorMessage.INVOICE_IS_NOT_FOUND);

    invoice.deposit(command.amount);

    await this.invoiceRepository.save(invoice);

    invoice.commit();
  }
}
