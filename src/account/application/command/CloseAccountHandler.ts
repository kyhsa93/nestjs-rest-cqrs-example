import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { throwError } from 'libs/ThrowError';
import { Transactional } from 'libs/Transactional';

import { CloseAccountCommand } from 'src/account/application/command/CloseAccountCommand';

import { ErrorMessage } from 'src/account/domain/ErrorMessage';
import { AccountRepository } from 'src/account/domain/AccountRepository';

@CommandHandler(CloseAccountCommand)
export class CloseAccountHandler implements ICommandHandler<
  CloseAccountCommand,
  void
> {
  constructor(private readonly accountRepository: AccountRepository) {}

  @Transactional()
  async execute(command: CloseAccountCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.accountId);
    if (!account) throwError(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.close();

    await this.accountRepository.save(account);
  }
}
