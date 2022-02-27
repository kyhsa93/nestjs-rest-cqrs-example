import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CloseAccountCommand } from 'src/account/application/commands/close-account.command';
import { InjectionToken } from 'src/account/application/injection.token';

import { ErrorMessage } from 'src/account/domain/error';
import { AccountRepository } from 'src/account/domain/repository';

@CommandHandler(CloseAccountCommand)
export class CloseAccountHandler
  implements ICommandHandler<CloseAccountCommand, void>
{
  constructor(
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(command: CloseAccountCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.id);
    if (!account)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.close(command.password);

    await this.accountRepository.save(account);

    account.commit();
  }
}
