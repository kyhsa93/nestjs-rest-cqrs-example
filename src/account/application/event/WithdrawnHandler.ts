import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  AccountWithdrawn,
  IntegrationEventPublisher,
  INTEGRATION_EVENT_PUBLISHER,
  Topic,
} from 'libs/MessageModule';

import { WithdrawnEvent } from 'src/account/domain/event/WithdrawnEvent';

@EventsHandler(WithdrawnEvent)
export class WithdrawnHandler implements IEventHandler<WithdrawnEvent> {
  @Inject(INTEGRATION_EVENT_PUBLISHER)
  private readonly integrationEventPublisher: IntegrationEventPublisher;

  async handle(event: WithdrawnEvent): Promise<void> {
    await this.integrationEventPublisher.publish(
      Topic.ACCOUNT_WITHDRAWN,
      new AccountWithdrawn(event.accountId, event.email),
    );
  }
}
