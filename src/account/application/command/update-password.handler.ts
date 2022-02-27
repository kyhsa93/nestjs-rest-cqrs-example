import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdatePasswordCommand } from 'src/account/application/command/update-password.command';
import { InjectionToken } from 'src/account/application/injection.token';

import { ErrorMessage } from 'src/account/domain/error';
import { AccountRepository } from 'src/account/domain/repository';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler
  implements ICommandHandler<UpdatePasswordCommand, void>
{
  constructor(
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(command: UpdatePasswordCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.id);
    if (!account)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.updatePassword(command.password, command.newPassword);

    await this.accountRepository.save(account);

    account.commit();
  }
}
