import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';

import AccountRepository from '../../../infrastructure/repository/account.repository';

import DeleteAccountCommand from '../implements/account.command.delete';


@CommandHandler(DeleteAccountCommand)
export default class DeleteAccountCommandHandler implements ICommandHandler<DeleteAccountCommand> {
  constructor(
    @Inject(AccountRepository) private readonly accountRepository: AccountRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  public async execute(command: DeleteAccountCommand): Promise<void> {
    const { id, password } = command;
    const model = await this.accountRepository.findById(id);
    if (!model) throw new NotFoundException();

    const account = this.eventPublisher.mergeObjectContext(model);

    if (!account.comparePassword(password)) {
      throw new UnauthorizedException();
    }

    account.delete();

    account.commit();

    await this.accountRepository.save(account);
  }
}
