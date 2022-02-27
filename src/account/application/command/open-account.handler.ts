import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { OpenAccountCommand } from 'src/account/application/command/open-account.command';
import { InjectionToken } from 'src/account/application/injection.token';

import { AccountFactory } from 'src/account/domain/factory';
import { AccountRepository } from 'src/account/domain/repository';

@CommandHandler(OpenAccountCommand)
export class OpenAccountHandler
  implements ICommandHandler<OpenAccountCommand, void>
{
  constructor(
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
    private readonly accountFactory: AccountFactory,
  ) {}

  async execute(command: OpenAccountCommand): Promise<void> {
    const account = this.accountFactory.create(
      await this.accountRepository.newId(),
      command.name,
    );

    account.open(command.password);

    await this.accountRepository.save(account);

    account.commit();
  }
}
