import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  PasswordGenerator,
  PASSWORD_GENERATOR,
} from 'libs/auth/password-module';
import { throwError } from 'libs/error/throw-error';
import { Transactional } from 'libs/database/transactional';

import { UpdatePasswordCommand } from 'src/account/application/command/update-password-command';

import { ErrorMessage } from 'src/account/domain/error-message';
import { AccountRepository } from 'src/account/domain/account-repository';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler implements ICommandHandler<
  UpdatePasswordCommand,
  void
> {
  constructor(
    private readonly accountRepository: AccountRepository,
    @Inject(PASSWORD_GENERATOR)
    private readonly passwordGenerator: PasswordGenerator,
  ) {}

  @Transactional()
  async execute(command: UpdatePasswordCommand): Promise<void> {
    const account = await this.accountRepository
      .findAccounts({ id: command.accountId, take: 1, page: 0 })
      .then((result) => result.accounts.pop());
    if (!account) throwError(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.updatePassword(
      this.passwordGenerator.generateKey(command.password),
    );

    await this.accountRepository.saveAccount(account);
  }
}
