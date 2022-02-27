import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DepositCommand } from 'src/account/application/commands/deposit.command';
import { InjectionToken } from 'src/account/application/injection.token';

import { ErrorMessage } from 'src/account/domain/error';
import { AccountRepository } from 'src/account/domain/repository';

@CommandHandler(DepositCommand)
export class DepositHandler implements ICommandHandler<DepositCommand, void> {
  constructor(
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(command: DepositCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.id);
    if (!account)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.deposit(command.amount);

    await this.accountRepository.save(account);

    account.commit();
  }
}
