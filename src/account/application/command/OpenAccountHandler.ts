import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PasswordGenerator, PASSWORD_GENERATOR } from 'libs/PasswordModule';
import { Transactional } from 'libs/Transactional';

import { OpenAccountCommand } from 'src/account/application/command/OpenAccountCommand';
import { InjectionToken } from 'src/account/application/InjectionToken';

import { AccountFactory } from 'src/account/domain/AccountFactory';
import { AccountRepository } from 'src/account/domain/AccountRepository';

@CommandHandler(OpenAccountCommand)
export class OpenAccountHandler
  implements ICommandHandler<OpenAccountCommand, void>
{
  @Inject(InjectionToken.ACCOUNT_REPOSITORY)
  private readonly accountRepository: AccountRepository;
  @Inject() private readonly accountFactory: AccountFactory;
  @Inject(PASSWORD_GENERATOR)
  private readonly passwordGenerator: PasswordGenerator;

  @Transactional()
  async execute(command: OpenAccountCommand): Promise<void> {
    const account = this.accountFactory.create({
      ...command,
      id: await this.accountRepository.newId(),
      password: this.passwordGenerator.generateKey(command.password),
    });

    account.open();

    await this.accountRepository.save(account);

    account.commit();
  }
}
