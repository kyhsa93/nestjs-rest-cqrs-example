import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/PasswordModule';
import { throwError } from 'libs/ThrowError';
import { Transactional } from 'libs/Transactional';

import { UpdatePasswordCommand } from 'src/account/application/command/UpdatePasswordCommand';

import { ErrorMessage } from 'src/account/domain/ErrorMessage';
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
    const account = await this.accountRepository.findById(command.accountId);
    if (!account) throwError(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.updatePassword(
      this.passwordGenerator.generateKey(command.password),
    );

    await this.accountRepository.save(account);
  }
}
