import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from 'src/account/application/events/integration';
import { InjectionToken } from 'src/account/application/injection.token';

import { AccountClosedEvent } from 'src/account/domain/events/account-closed.event';

@EventsHandler(AccountClosedEvent)
export class AccountClosedHandler implements IEventHandler<AccountClosedEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject(InjectionToken.INTEGRATION_EVENT_PUBLISHER)
    private readonly publisher: IntegrationEventPublisher,
    @Inject(InjectionToken.EVENT_STORE) private readonly eventStore: EventStore,
  ) {}

  async handle(event: AccountClosedEvent): Promise<void> {
    this.logger.log(
      `${IntegrationEventSubject.CLOSED}: ${JSON.stringify(event)}`,
    );
    await this.publisher.publish({
      subject: IntegrationEventSubject.CLOSED,
      data: { id: event.id },
    });
    await this.eventStore.save({
      subject: IntegrationEventSubject.CLOSED,
      data: event,
    });
  }
}
