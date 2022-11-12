import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  AccountPasswordUpdated,
  IntegrationEventPublisher,
  INTEGRATION_EVENT_PUBLISHER,
  Topic,
} from 'libs/MessageModule';
import { Transactional } from 'libs/Transactional';

import { PasswordUpdatedEvent } from 'src/account/domain/event/PasswordUpdatedEvent';

@EventsHandler(PasswordUpdatedEvent)
export class PasswordUpdatedHandler
  implements IEventHandler<PasswordUpdatedEvent>
{
  @Inject(INTEGRATION_EVENT_PUBLISHER)
  private readonly integrationEventPublisher: IntegrationEventPublisher;

  @Transactional()
  async handle(event: PasswordUpdatedEvent): Promise<void> {
    await this.integrationEventPublisher.publish(
      Topic.ACCOUNT_PASSWORD_UPDATED,
      new AccountPasswordUpdated(event.accountId, event.email),
    );
  }
}
