import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { CloseAccountCommand } from 'src/accounts/application/commands/close-account.command';
import { InjectionToken } from 'src/accounts/application/injection.token';

import { AccountRepository } from 'src/accounts/domain/repository';

@CommandHandler(CloseAccountCommand)
export class CloseAccountHandler
  implements ICommandHandler<CloseAccountCommand, void>
{
  constructor(
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CloseAccountCommand): Promise<void> {
    const data = await this.accountRepository.findById(command.id);
    if (!data) throw new NotFoundException();

    const account = this.eventPublisher.mergeObjectContext(data);

    account.close(command.password);

    await this.accountRepository.save(account);

    account.commit();
  }
}
