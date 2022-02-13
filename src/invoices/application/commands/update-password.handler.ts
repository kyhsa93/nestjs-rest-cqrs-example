import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdatePasswordCommand } from 'src/invoices/application/commands/update-password.command';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { ErrorMessage } from 'src/invoices/domain/error/error';
import { InvoiceRepository } from 'src/invoices/domain/repository/repository';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler
  implements ICommandHandler<UpdatePasswordCommand, void>
{
  constructor(
    @Inject(InjectionToken.INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(command: UpdatePasswordCommand): Promise<void> {
    const invoice = await this.invoiceRepository.findById(command.id);
    if (!invoice)
      throw new NotFoundException(ErrorMessage.INVOICE_IS_NOT_FOUND);

    invoice.updatePassword(command.password, command.newPassword);

    await this.invoiceRepository.save(invoice);

    invoice.commit();
  }
}
