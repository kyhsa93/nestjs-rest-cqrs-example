import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  EventStore,
  IntegrationEventPublisher,
} from 'src/accounts/application/events/integration';

import { WithdrawnEvent } from 'src/accounts/domain/events/withdrawn.event';

@EventsHandler(WithdrawnEvent)
export class WithdrawnHandler implements IEventHandler<WithdrawnEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject('IntegrationEventPublisherImplement')
    private readonly publisher: IntegrationEventPublisher,
    @Inject('EventStoreImplement') private readonly eventStore: EventStore,
  ) {}

  async handle(event: WithdrawnEvent): Promise<void> {
    this.logger.log(`account withdrawn: ${JSON.stringify(event)}`);
    await this.publisher.publish({
      subject: 'withdrawn',
      data: { id: event.id },
    });
    await this.eventStore.save({ subject: 'account withdrawn', data: event });
  }
}
