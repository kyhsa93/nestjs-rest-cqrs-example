import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { throwError } from 'libs/throw-error';
import { Transactional } from 'libs/transactional';

import { WithdrawCommand } from 'src/account/application/command/withdraw-command';

import { ErrorMessage } from 'src/account/domain/error-message';
import { AccountRepository } from 'src/account/domain/account-repository';

@CommandHandler(WithdrawCommand)
export class WithdrawHandler implements ICommandHandler<WithdrawCommand, void> {
  constructor(private readonly accountRepository: AccountRepository) {}

  @Transactional()
  async execute(command: WithdrawCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.accountId);
    if (!account) throwError(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.withdraw(command.amount);

    await this.accountRepository.save(account);
  }
}
