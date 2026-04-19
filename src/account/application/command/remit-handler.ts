import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { throwError } from 'libs/error/throw-error';
import { Transactional } from 'libs/database/transactional';

import { RemitCommand } from 'src/account/application/command/remit-command';

import { ErrorMessage } from 'src/account/domain/error-message';
import { AccountRepository } from 'src/account/domain/account-repository';
import { AccountDomainService } from 'src/account/domain/account-domain-service';

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

    const account = await this.accountRepository
      .findAccounts({ id: command.accountId, take: 1, page: 0 })
      .then((result) => result.accounts.pop());
    if (!account) throwError(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    const receiver = await this.accountRepository
      .findAccounts({ id: command.receiverId, take: 1, page: 0 })
      .then((result) => result.accounts.pop());
    if (!receiver) throwError(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    this.accountDomainService.remit({ ...command, account, receiver });

    await this.accountRepository.save([account, receiver]);
  }
}
