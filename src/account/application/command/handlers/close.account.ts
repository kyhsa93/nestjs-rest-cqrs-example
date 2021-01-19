import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { Transaction } from 'typeorm';

import CloseAccountCommand from '@src/account/application/command/implements/close.account';

import AccountRepository from '@src/account/domain/repository';

@CommandHandler(CloseAccountCommand)
export default class CloseAccountCommandHandler implements ICommandHandler<CloseAccountCommand> {
  constructor(
    @Inject('AccountRepositoryImplement') private readonly accountRepository: AccountRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  @Transaction()
  public async execute(command: CloseAccountCommand): Promise<void> {
    const { id, password } = command;
    const model = await this.accountRepository.findById(id);
    if (!model) throw new NotFoundException();

    const account = this.eventPublisher.mergeObjectContext(model);

    account.close(password);

    await this.accountRepository.save(account);
    
    account.commit();
  }
}
