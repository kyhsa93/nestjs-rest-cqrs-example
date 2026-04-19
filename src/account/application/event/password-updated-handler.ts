import { Inject, Injectable } from '@nestjs/common';

import { AccountPasswordUpdated } from 'libs/message-module';

import { PasswordUpdatedEvent } from 'src/account/domain/event/password-updated-event';
import { HandleEvent } from 'src/outbox/handle-event';
import { OutboxWriter } from 'src/outbox/outbox-writer';

@Injectable()
export class PasswordUpdatedHandler {
  @Inject() private readonly outboxWriter: OutboxWriter;

  @HandleEvent(PasswordUpdatedEvent.name)
  async handle(event: PasswordUpdatedEvent): Promise<void> {
    await this.outboxWriter.saveAll([
      new AccountPasswordUpdated(event.accountId, event.email),
    ]);
  }
}
