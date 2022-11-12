import { Controller, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { MessageHandler } from 'libs/MessageModule';

import { LockAccountCommand } from 'src/account/application/command/LockAccountCommand';

@Controller()
export class AccountTaskController {
  @Inject() private readonly commandBus: CommandBus;

  @MessageHandler(LockAccountCommand.name)
  async lockAccount(message: LockAccountCommand): Promise<void> {
    await this.commandBus.execute<LockAccountCommand, void>(message);
  }
}
