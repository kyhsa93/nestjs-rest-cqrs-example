import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/password-module';
import { Transactional } from 'libs/transactional';

import { OpenAccountCommand } from 'src/account/application/command/open-account-command';

import { AccountFactory } from 'src/account/domain/account-factory';
import { AccountRepository } from 'src/account/domain/account-repository';

@CommandHandler(OpenAccountCommand)
export class OpenAccountHandler implements ICommandHandler<
  OpenAccountCommand,
  void
> {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly accountFactory: AccountFactory,
    @Inject(PASSWORD_GENERATOR)
    private readonly passwordGenerator: PasswordGenerator,
  ) {}

  @Transactional()
  async execute(command: OpenAccountCommand): Promise<void> {
    const account = this.accountFactory.create({
      ...command,
      id: await this.accountRepository.newId(),
      password: this.passwordGenerator.generateKey(command.password),
    });

    account.open();

    await this.accountRepository.save(account);
  }
}
