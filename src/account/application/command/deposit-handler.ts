import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { throwError } from 'libs/throw-error';
import { Transactional } from 'libs/transactional';

import { DepositCommand } from 'src/account/application/command/deposit-command';

import { ErrorMessage } from 'src/account/domain/error-message';
import { AccountRepository } from 'src/account/domain/account-repository';

@CommandHandler(DepositCommand)
export class DepositHandler implements ICommandHandler<DepositCommand, void> {
  constructor(private readonly accountRepository: AccountRepository) {}

  @Transactional()
  async execute(command: DepositCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.accountId);
    if (!account) throwError(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.deposit(command.amount);

    await this.accountRepository.save(account);
  }
}
