import { Inject, Injectable } from '@nestjs/common';

import { AccountClosed } from 'libs/message/message-module';

import { AccountClosedEvent } from 'src/account/domain/event/account-closed-event';
import { HandleEvent } from 'src/outbox/handle-event';
import { OutboxWriter } from 'src/outbox/outbox-writer';

@Injectable()
export class AccountClosedHandler {
  @Inject() private readonly outboxWriter: OutboxWriter;

  @HandleEvent(AccountClosedEvent.name)
  async handle(event: AccountClosedEvent): Promise<void> {
    await this.outboxWriter.saveAll([
      new AccountClosed(event.accountId, event.email),
    ]);
  }
}
