import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  EventStore,
  IntegrationEventPublisher,
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
    this.logger.log(`account deposited: ${JSON.stringify(event)}`);
    await this.publisher.publish({
      subject: 'deposited',
      data: { id: event.id },
    });
    await this.eventStore.save({ subject: 'deposited', data: event });
  }
}
