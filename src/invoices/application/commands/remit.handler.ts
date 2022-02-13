import {
  Inject,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { RemitCommand } from 'src/invoices/application/commands/remit.command';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { ErrorMessage } from 'src/invoices/domain/error/error';
import { InvoiceRepository } from 'src/invoices/domain/repository/repository';
import { InvoiceService } from 'src/invoices/domain/service/service';

@CommandHandler(RemitCommand)
export class RemitHandler implements ICommandHandler<RemitCommand, void> {
  constructor(
    @Inject(InjectionToken.INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceService: InvoiceService,
  ) {}

  async execute(command: RemitCommand): Promise<void> {
    if (command.id === command.receiverId)
      throw new UnprocessableEntityException(
        ErrorMessage.WITHDRAWAL_AND_DEPOSIT_INVOICES_CANNOT_BE_THE_SAME,
      );

    const invoices = await this.invoiceRepository.findByIds([
      command.id,
      command.receiverId,
    ]);
    if (invoices.length !== 2) {
      throw new NotFoundException(ErrorMessage.INVOICE_IS_NOT_FOUND);
    }

    const invoice = invoices.find((item) => item.compareId(command.id));
    if (!invoice)
      throw new NotFoundException(ErrorMessage.INVOICE_IS_NOT_FOUND);

    const receiver = invoices.find((item) =>
      item.compareId(command.receiverId),
    );
    if (!receiver)
      throw new UnprocessableEntityException(
        ErrorMessage.RECEIVER_INVOICE_IS_NOT_FOUND,
      );

    const { password, amount } = command;
    this.invoiceService.remit({ invoice, receiver, password, amount });

    await this.invoiceRepository.save([invoice, receiver]);

    invoice.commit();
    receiver.commit();
  }
}
