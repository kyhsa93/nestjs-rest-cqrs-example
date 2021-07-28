import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from 'src/accounts/application/events/integration';
import { InjectionToken } from 'src/accounts/application/injection.token';

import { AccountOpenedEvent } from 'src/accounts/domain/events/account-opened.event';

@EventsHandler(AccountOpenedEvent)
export class AccountOpenedHandler implements IEventHandler<AccountOpenedEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject(InjectionToken.INTEGRATION_EVENT_PUBLISHER)
    private readonly publisher: IntegrationEventPublisher,
    @Inject(InjectionToken.EVENT_STORE) private readonly eventStore: EventStore,
  ) {}

  async handle(event: AccountOpenedEvent): Promise<void> {
    this.logger.log(
      `${IntegrationEventSubject.OPENED}: ${JSON.stringify(event)}`,
    );
    await this.publisher.publish({
      subject: IntegrationEventSubject.OPENED,
      data: { id: event.id },
    });
    await this.eventStore.save({
      subject: IntegrationEventSubject.OPENED,
      data: event,
    });
  }
}
