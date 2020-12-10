import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';

import CreateAccountCommand from '@src/account/application/command/implements/create.account';

import AccountFactory from '@src/account/domain/factory';
import AccountRepository from '@src/account/domain/repository';

@CommandHandler(CreateAccountCommand)
export default class CreateAccountCommandHandler implements ICommandHandler<CreateAccountCommand> {
  constructor(
    private readonly accountFactory: AccountFactory,
    private readonly eventPublisher: EventPublisher,
    @Inject('AccountRepositoryImplement') private readonly accountRepository: AccountRepository,
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
