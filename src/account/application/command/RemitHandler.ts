import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { throwError } from 'libs/ThrowError';
import { Transactional } from 'libs/Transactional';

import { RemitCommand } from 'src/account/application/command/RemitCommand';

import { ErrorMessage } from 'src/account/domain/ErrorMessage';
import { AccountRepository } from 'src/account/domain/account-repository';
import { AccountDomainService } from 'src/account/domain/AccountDomainService';

@CommandHandler(RemitCommand)
export class RemitHandler implements ICommandHandler<RemitCommand, void> {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly accountDomainService: AccountDomainService,
  ) {}

  @Transactional()
  async execute(command: RemitCommand): Promise<void> {
    if (command.accountId === command.receiverId)
      throwError(
        ErrorMessage.WITHDRAWAL_AND_DEPOSIT_ACCOUNTS_CANNOT_BE_THE_SAME,
      );

    const account = await this.accountRepository.findById(command.accountId);
    if (!account) throwError(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    const receiver = await this.accountRepository.findById(command.receiverId);
    if (!receiver) throwError(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    this.accountDomainService.remit({ ...command, account, receiver });

    await this.accountRepository.save([account, receiver]);
  }
}
