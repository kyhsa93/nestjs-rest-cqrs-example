import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from 'src/accounts/application/events/integration';

import { DepositedEvent } from 'src/accounts/domain/events/deposited.event';

@EventsHandler(DepositedEvent)
export class DepositedHandler implements IEventHandler<DepositedEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject('IntegrationEventPublisherImplement')
    private readonly publisher: IntegrationEventPublisher,
    @Inject('EventStoreImplement') private readonly eventStore: EventStore,
  ) {}

  async handle(event: DepositedEvent): Promise<void> {
    this.logger.log(
      `${IntegrationEventSubject.DEPOSITED}: ${JSON.stringify(event)}`,
    );
    await this.publisher.publish({
      subject: IntegrationEventSubject.DEPOSITED,
      data: { id: event.id },
    });
    await this.eventStore.save({
      subject: IntegrationEventSubject.DEPOSITED,
      data: event,
    });
  }
}
