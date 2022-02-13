import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from 'src/invoices/application/events/integration';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { InvoiceClosedEvent } from 'src/invoices/domain/events/invoice-closed.event';

@EventsHandler(InvoiceClosedEvent)
export class InvoiceClosedHandler implements IEventHandler<InvoiceClosedEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject(InjectionToken.INTEGRATION_EVENT_PUBLISHER)
    private readonly publisher: IntegrationEventPublisher,
    @Inject(InjectionToken.EVENT_STORE) private readonly eventStore: EventStore,
  ) {}

  async handle(event: InvoiceClosedEvent): Promise<void> {
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
