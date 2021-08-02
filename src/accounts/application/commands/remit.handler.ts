import {
  Inject,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

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
    private readonly accountService: AccountService,
  ) {}

  async execute(command: RemitCommand): Promise<void> {
    if (command.id === command.receiverId)
      throw new UnprocessableEntityException(
        ErrorMessage.WITHDRAWAL_AND_DEPOSIT_ACCOUNTS_CANNOT_BE_THE_SAME,
      );

    const accounts = await this.accountRepository.findByIds([command.id, command.receiverId]);
    if (accounts.length !== 2) {
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    }
    
    const account = accounts.find(item => item.compareId(command.id));
    if (!account)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    const receiver = accounts.find(item => item.compareId(command.receiverId));
    if (!receiver)
      throw new UnprocessableEntityException(
        ErrorMessage.RECEIVER_ACCOUNT_IS_NOT_FOUND,
      );

    const { password, amount } = command;
    this.accountService.remit({ account, receiver, password, amount });

    await this.accountRepository.save([account, receiver]);

    account.commit();
    receiver.commit();
  }
}
