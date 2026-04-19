import { Inject, Injectable } from '@nestjs/common';

import { AccountWithdrawn } from 'libs/message-module';

import { WithdrawnEvent } from 'src/account/domain/event/withdrawn-event';
import { HandleEvent } from 'src/outbox/handle-event';
import { OutboxWriter } from 'src/outbox/outbox-writer';

@Injectable()
export class WithdrawnHandler {
  @Inject() private readonly outboxWriter: OutboxWriter;

  @HandleEvent(WithdrawnEvent.name)
  async handle(event: WithdrawnEvent): Promise<void> {
    await this.outboxWriter.saveAll([
      new AccountWithdrawn(event.accountId, event.email),
    ]);
  }
}
