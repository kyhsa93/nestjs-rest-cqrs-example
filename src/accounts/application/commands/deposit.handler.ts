import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { DepositCommand } from 'src/accounts/application/commands/deposit.command';

import { AccountRepository } from 'src/accounts/domain/repository';

@CommandHandler(DepositCommand)
export class DepositHandler implements ICommandHandler<DepositCommand> {
  constructor(
    @Inject('AccountRepositoryImplement')
    private readonly accountRepository: AccountRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DepositCommand): Promise<any> {
    const data = await this.accountRepository.findById(command.id);
    if (!data) throw new NotFoundException();

    const account = this.eventPublisher.mergeObjectContext(data);

    account.deposit(command.amount, command.password);

    await this.accountRepository.save(account);

    account.commit();
  }
}
