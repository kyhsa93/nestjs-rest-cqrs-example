import { Inject, Injectable } from '@nestjs/common';

import { AccountDeposited } from 'libs/MessageModule';

import { DepositedEvent } from 'src/account/domain/event/DepositedEvent';
import { HandleEvent } from 'src/outbox/HandleEvent';
import { OutboxWriter } from 'src/outbox/OutboxWriter';

@Injectable()
export class DepositedHandler {
  @Inject() private readonly outboxWriter: OutboxWriter;

  @HandleEvent(DepositedEvent.name)
  async handle(event: DepositedEvent): Promise<void> {
    await this.outboxWriter.saveAll([
      new AccountDeposited(event.accountId, event.email),
    ]);
  }
}
