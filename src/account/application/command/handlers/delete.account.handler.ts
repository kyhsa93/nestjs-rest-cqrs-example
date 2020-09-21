import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';

import AccountRepository from '@src/account/infrastructure/repository/account.repository';

import DeleteAccountCommand from '@src/account/application/command/implements/delete.account';

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
    if (!(await model.comparePassword(password))) throw new UnauthorizedException();

    const account = this.eventPublisher.mergeObjectContext(model);

    account.delete();

    account.commit();

    await this.accountRepository.save(account);
  }
}
