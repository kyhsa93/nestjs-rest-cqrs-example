import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { WithdrawCommand } from 'src/accounts/application/commands/withdraw.command';

import { AccountRepository } from 'src/accounts/domain/repository';

@CommandHandler(WithdrawCommand)
export class WithdrawHandler implements ICommandHandler<WithdrawCommand> {
  constructor(
    @Inject('AccountRepositoryImplement')
    private readonly accountRepository: AccountRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: WithdrawCommand): Promise<void> {
    const data = await this.accountRepository.findById(command.id);
    if (!data) throw new NotFoundException();

    const account = this.eventPublisher.mergeObjectContext(data);

    account.withdraw(command.amount, command.password);

    await this.accountRepository.save(account);

    account.commit();
  }
}
