import { Transaction } from 'typeorm';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import OpenAccountCommand from '@src/account/application/command/implements/open.account';

import AccountFactory from '@src/account/domain/factory';
import AccountRepository from '@src/account/domain/repository';

@CommandHandler(OpenAccountCommand)
export default class OpenAccountCommandHandler implements ICommandHandler<OpenAccountCommand> {
  constructor(
    private readonly accountFactory: AccountFactory,
    private readonly eventPublisher: EventPublisher,
    @Inject('AccountRepositoryImplement') private readonly accountRepository: AccountRepository,
  ) {}

  @Transaction()
  public async execute(command: OpenAccountCommand): Promise<void> {
    const { name, password } = command;

    const id = await this.accountRepository.newId();

    const account = this.eventPublisher.mergeObjectContext(
      this.accountFactory.create(id, name, password),
    );

    await this.accountRepository.save(account);
    
    account.commit();
  }
}
