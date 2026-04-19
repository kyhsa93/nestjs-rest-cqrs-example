import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { throwError } from 'libs/ThrowError';
import { Transactional } from 'libs/Transactional';

import { LockAccountCommand } from 'src/account/application/command/LockAccountCommand';

import { ErrorMessage } from 'src/account/domain/ErrorMessage';
import { AccountRepository } from 'src/account/domain/AccountRepository';

@CommandHandler(LockAccountCommand)
export class LockAccountHandler implements ICommandHandler<
  LockAccountCommand,
  void
> {
  constructor(private readonly accountRepository: AccountRepository) {}

  @Transactional()
  async execute(command: LockAccountCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.accountId);
    if (!account) throwError(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.lock();

    await this.accountRepository.save(account);
  }
}
