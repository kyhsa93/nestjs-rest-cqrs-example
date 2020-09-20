import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';

import AccountRepository from '../../../infrastructure/repository/account.repository';

import UpdateAccountCommand from '../implements/account.command.update';

@CommandHandler(UpdateAccountCommand)
export default class UpdateAccountCommandHandler implements ICommandHandler<UpdateAccountCommand> {
  constructor(
    @Inject(AccountRepository) private readonly accountRepository: AccountRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  public async execute(command: UpdateAccountCommand): Promise<void> {
    const { id, oldPassword, newPassword } = command;
    const model = await this.accountRepository.findById(id);
    if (!model) throw new NotFoundException();

    const account = this.eventPublisher.mergeObjectContext(model);

    await account.updatePassword(oldPassword, newPassword);

    account.commit();

    await this.accountRepository.save(account);
  }
}
