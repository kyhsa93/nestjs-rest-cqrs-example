import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { throwError } from 'libs/error/throw-error';
import { Transactional } from 'libs/database/transactional';

import { CloseAccountCommand } from 'src/account/application/command/close-account-command';

import { ErrorMessage } from 'src/account/domain/error-message';
import { AccountRepository } from 'src/account/domain/account-repository';

@CommandHandler(CloseAccountCommand)
export class CloseAccountHandler implements ICommandHandler<
  CloseAccountCommand,
  void
> {
  constructor(private readonly accountRepository: AccountRepository) {}

  @Transactional()
  async execute(command: CloseAccountCommand): Promise<void> {
    const account = await this.accountRepository
      .findAccounts({ id: command.accountId, take: 1, page: 0 })
      .then((result) => result.accounts.pop());
    if (!account) throwError(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.close();

    await this.accountRepository.save(account);
  }
}
