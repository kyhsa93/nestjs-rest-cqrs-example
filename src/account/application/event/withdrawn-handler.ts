import { Inject, Injectable } from '@nestjs/common';

import { AccountWithdrawn } from 'libs/MessageModule';

import { WithdrawnEvent } from 'src/account/domain/event/WithdrawnEvent';
import { HandleEvent } from 'src/outbox/HandleEvent';
import { OutboxWriter } from 'src/outbox/OutboxWriter';

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
