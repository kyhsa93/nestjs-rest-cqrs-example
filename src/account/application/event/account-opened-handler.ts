import { Inject, Injectable } from '@nestjs/common';

import { AccountOpened } from 'libs/message/message-module';

import { AccountOpenedEvent } from 'src/account/domain/event/account-opened-event';
import { HandleEvent } from 'src/outbox/handle-event';
import { OutboxWriter } from 'src/outbox/outbox-writer';

@Injectable()
export class AccountOpenedHandler {
  @Inject() private readonly outboxWriter: OutboxWriter;

  @HandleEvent(AccountOpenedEvent.name)
  async handle(event: AccountOpenedEvent): Promise<void> {
    await this.outboxWriter.saveAll([
      new AccountOpened(event.accountId, event.email),
    ]);
  }
}
