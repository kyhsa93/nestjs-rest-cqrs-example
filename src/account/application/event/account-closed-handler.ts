import { Inject, Injectable } from '@nestjs/common';

import { AccountClosed } from 'libs/MessageModule';

import { AccountClosedEvent } from 'src/account/domain/event/AccountClosedEvent';
import { HandleEvent } from 'src/outbox/HandleEvent';
import { OutboxWriter } from 'src/outbox/OutboxWriter';

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
