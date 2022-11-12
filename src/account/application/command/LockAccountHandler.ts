import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from 'libs/Transactional';

import { LockAccountCommand } from 'src/account/application/command/LockAccountCommand';
import { InjectionToken } from 'src/account/application/InjectionToken';

import { AccountRepository } from 'src/account/domain/AccountRepository';

@CommandHandler(LockAccountCommand)
export class LockAccountHandler
  implements ICommandHandler<LockAccountCommand, void>
{
  @Inject(InjectionToken.ACCOUNT_REPOSITORY)
  private readonly accountRepository: AccountRepository;

  @Transactional()
  async execute(command: LockAccountCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.accountId);
    if (!account) throw new NotFoundException('Account is not found');

    account.lock();

    await this.accountRepository.save(account);

    account.commit();
  }
}
