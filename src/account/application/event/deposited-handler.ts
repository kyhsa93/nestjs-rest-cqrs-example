import { Inject, Injectable } from '@nestjs/common';

import { AccountDeposited } from 'libs/message-module';

import { DepositedEvent } from 'src/account/domain/event/deposited-event';
import { HandleEvent } from 'src/outbox/handle-event';
import { OutboxWriter } from 'src/outbox/outbox-writer';

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
