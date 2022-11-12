import {
  Inject,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from 'libs/Transactional';

import { RemitCommand } from 'src/account/application/command/RemitCommand';
import { InjectionToken } from 'src/account/application/InjectionToken';

import { ErrorMessage } from 'src/account/domain/ErrorMessage';
import { AccountRepository } from 'src/account/domain/AccountRepository';
import { AccountDomainService } from 'src/account/domain/AccountDomainService';

@CommandHandler(RemitCommand)
export class RemitHandler implements ICommandHandler<RemitCommand, void> {
  @Inject(InjectionToken.ACCOUNT_REPOSITORY)
  private readonly accountRepository: AccountRepository;
  @Inject() private readonly accountDomainService: AccountDomainService;

  @Transactional()
  async execute(command: RemitCommand): Promise<void> {
    if (command.accountId === command.receiverId)
      throw new UnprocessableEntityException(
        ErrorMessage.WITHDRAWAL_AND_DEPOSIT_ACCOUNTS_CANNOT_BE_THE_SAME,
      );

    const account = await this.accountRepository.findById(command.accountId);
    if (!account)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    const receiver = await this.accountRepository.findById(command.receiverId);
    if (!receiver)
      throw new UnprocessableEntityException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    this.accountDomainService.remit({ ...command, account, receiver });

    await this.accountRepository.save([account, receiver]);

    account.commit();
    receiver.commit();
  }
}
