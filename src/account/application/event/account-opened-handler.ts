import { Inject, Injectable } from '@nestjs/common';

import { AccountOpened } from 'libs/MessageModule';

import { AccountOpenedEvent } from 'src/account/domain/event/AccountOpenedEvent';
import { HandleEvent } from 'src/outbox/HandleEvent';
import { OutboxWriter } from 'src/outbox/OutboxWriter';

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
