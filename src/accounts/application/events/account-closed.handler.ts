import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from 'src/accounts/application/events/integration';

import { AccountClosedEvent } from 'src/accounts/domain/events/account-closed.event';

@EventsHandler(AccountClosedEvent)
export class AccountClosedHandler implements IEventHandler<AccountClosedEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject('IntegrationEventPublisherImplement')
    private readonly publisher: IntegrationEventPublisher,
    @Inject('EventStoreImplement') private readonly eventStore: EventStore,
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
