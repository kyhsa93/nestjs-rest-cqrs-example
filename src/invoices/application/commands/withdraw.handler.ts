import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { WithdrawCommand } from 'src/invoices/application/commands/withdraw.command';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { ErrorMessage } from 'src/invoices/domain/error/error';
import { InvoiceRepository } from 'src/invoices/domain/repository/repository';

@CommandHandler(WithdrawCommand)
export class WithdrawHandler implements ICommandHandler<WithdrawCommand, void> {
  constructor(
    @Inject(InjectionToken.INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(command: WithdrawCommand): Promise<void> {
    const invoice = await this.invoiceRepository.findById(command.id);
    if (!invoice)
      throw new NotFoundException(ErrorMessage.INVOICE_IS_NOT_FOUND);

    invoice.withdraw(command.amount, command.password);

    await this.invoiceRepository.save(invoice);

    invoice.commit();
  }
}
