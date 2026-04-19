import { Inject, Injectable } from '@nestjs/common';

import { AccountPasswordUpdated } from 'libs/MessageModule';

import { PasswordUpdatedEvent } from 'src/account/domain/event/PasswordUpdatedEvent';
import { HandleEvent } from 'src/outbox/HandleEvent';
import { OutboxWriter } from 'src/outbox/OutboxWriter';

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
