import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { WithdrawCommand } from 'src/account/application/commands/withdraw.command';
import { InjectionToken } from 'src/account/application/injection.token';

import { ErrorMessage } from 'src/account/domain/error';
import { AccountRepository } from 'src/account/domain/repository';

@CommandHandler(WithdrawCommand)
export class WithdrawHandler implements ICommandHandler<WithdrawCommand, void> {
  constructor(
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(command: WithdrawCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.id);
    if (!account)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.withdraw(command.amount, command.password);

    await this.accountRepository.save(account);

    account.commit();
  }
}
