import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { Withdraw } from "@src/account/application/command/implements/withdraw.account";
import AccountRepository from "@src/account/domain/repository";

@CommandHandler(Withdraw)
export class WithdrawHandler implements ICommandHandler<Withdraw> {
  constructor(
    @Inject('AccountRepositoryImplement') readonly accountRepository: AccountRepository,
    readonly eventPublisher: EventPublisher,
  ) {}
  async execute(command: Withdraw): Promise<void> {
    const data = await this.accountRepository.findById(command.id);
    if (!data) throw new NotFoundException();

    const account = this.eventPublisher.mergeObjectContext(data);

    account.withdraw(command.amount, command.password);

    await this.accountRepository.save(account);

    account.commit();
  }
}