import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';

import AccountRepository from '@src/account/infrastructure/repository/account';

import CreateAccountCommand from '@src/account/application/command/implements/create.account';

import AccountFactory from '@src/account/domain/model/account.factory';

@CommandHandler(CreateAccountCommand)
export default class CreateAccountCommandHandler implements ICommandHandler<CreateAccountCommand> {
  constructor(
    @Inject(AccountFactory) private readonly accountFactory: AccountFactory,
    @Inject(AccountRepository) private readonly accountRepository: AccountRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  public async execute(command: CreateAccountCommand): Promise<void> {
    const { email, password } = command;

    const accounts = await this.accountRepository.findByEmail(email);
    if (accounts.length) throw new BadRequestException('duplicated email');

    const id = await this.accountRepository.newId();

    const account = this.eventPublisher.mergeObjectContext(
      this.accountFactory.create(id, email, password),
    );

    account.commit();

    await this.accountRepository.save(account);
  }
}
