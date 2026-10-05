import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { throwError } from 'libs/error/throw-error';
import { Transactional } from 'libs/database/transactional';

import { LockAccountCommand } from 'src/account/application/command/lock-account-command';

import { ErrorMessage } from 'src/account/domain/error-message';
import { AccountRepository } from 'src/account/domain/account-repository';

@CommandHandler(LockAccountCommand)
export class LockAccountHandler implements ICommandHandler<
  LockAccountCommand,
  void
> {
  constructor(private readonly accountRepository: AccountRepository) {}

  @Transactional()
  async execute(command: LockAccountCommand): Promise<void> {
    const account = await this.accountRepository
      .findAccounts({ id: command.accountId, take: 1, page: 0 })
      .then((result) => result.accounts.pop());
    if (!account) throwError(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.lock();

    await this.accountRepository.saveAccount(account);
  }
}
