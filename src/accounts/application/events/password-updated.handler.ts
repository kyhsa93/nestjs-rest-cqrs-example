import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { EventStore, IntegrationEventPublisher } from 'src/accounts/application/events/integration';

import { PasswordUpdatedEvent } from 'src/accounts/domain/events/password-updated.event';

@EventsHandler(PasswordUpdatedEvent)
export class PasswordUpdatedHandler
  implements IEventHandler<PasswordUpdatedEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject('IntegrationEventPublisherImplement')
    private readonly publisher: IntegrationEventPublisher,
    @Inject('EventStoreImplement') private readonly eventStore: EventStore,
  ) {}

  async handle(event: PasswordUpdatedEvent): Promise<void> {
    this.logger.log(`account password updated: ${JSON.stringify(event)}`);
    await this.publisher.publish({
      subject: 'password.updated',
      data: { id: event.id },
    });
    await this.eventStore.save({ subject: 'password.updated', data: event });
  }
}
