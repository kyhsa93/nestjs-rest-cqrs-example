import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { EventStore, IntegrationEventPublisher } from 'src/accounts/application/events/integration';

import { AccountOpenedEvent } from 'src/accounts/domain/events/account-opened.event';

@EventsHandler(AccountOpenedEvent)
export class AccountOpenedHandler implements IEventHandler<AccountOpenedEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject('IntegrationEventPublisherImplement')
    private readonly publisher: IntegrationEventPublisher,
    @Inject('EventStoreImplement') private readonly eventStore: EventStore,
  ) {}

  async handle(event: AccountOpenedEvent): Promise<void> {
    this.logger.log(`account opened: ${JSON.stringify(event)}`);
    await this.publisher.publish({
      subject: 'account.opened',
      data: { id: event.id },
    });
    await this.eventStore.save({ subject: 'account.opened', data: event });
  }
}
