import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {
  AccountDeposited,
  IntegrationEventPublisher,
  INTEGRATION_EVENT_PUBLISHER,
  Topic,
} from 'libs/MessageModule';

import { DepositedEvent } from 'src/account/domain/event/DepositedEvent';

@EventsHandler(DepositedEvent)
export class DepositedHandler implements IEventHandler<DepositedEvent> {
  @Inject(INTEGRATION_EVENT_PUBLISHER)
  private readonly integrationEventPublisher: IntegrationEventPublisher;

  async handle(event: DepositedEvent): Promise<void> {
    await this.integrationEventPublisher.publish(
      Topic.ACCOUNT_DEPOSITED,
      new AccountDeposited(event.accountId, event.email),
    );
  }
}
