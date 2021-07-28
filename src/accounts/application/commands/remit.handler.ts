import {
  Inject,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { RemitCommand } from 'src/accounts/application/commands/remit.command';
import { InjectionToken } from 'src/accounts/application/injection.token';

import { ErrorMessage } from 'src/accounts/domain/error';
import { AccountRepository } from 'src/accounts/domain/repository';
import { AccountService } from 'src/accounts/domain/service';

@CommandHandler(RemitCommand)
export class RemitHandler implements ICommandHandler<RemitCommand, void> {
  constructor(
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly accountService: AccountService,
  ) {}

  async execute(command: RemitCommand): Promise<void> {
    const senderData = await this.accountRepository.findById(command.senderId);
    if (!senderData) throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    const sender = this.eventPublisher.mergeObjectContext(senderData);

    const receiverData = await this.accountRepository.findById(
      command.receiverId,
    );
    if (!receiverData)
      throw new UnprocessableEntityException(
        ErrorMessage.RECEIVER_ACCOUNT_IS_NOT_FOUND,
      );

    const receiver = this.eventPublisher.mergeObjectContext(receiverData);

    const { password, amount } = command;
    this.accountService.remit({ sender, receiver, password, amount });

    await this.accountRepository.save([receiver, sender]);

    receiver.commit();
    sender.commit();
  }
}
