import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from 'src/invoices/application/events/integration';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { InvoiceOpenedEvent } from 'src/invoices/domain/events/invoice-opened.event';

@EventsHandler(InvoiceOpenedEvent)
export class InvoiceOpenedHandler implements IEventHandler<InvoiceOpenedEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject(InjectionToken.INTEGRATION_EVENT_PUBLISHER)
    private readonly publisher: IntegrationEventPublisher,
    @Inject(InjectionToken.EVENT_STORE) private readonly eventStore: EventStore,
  ) {}

  async handle(event: InvoiceOpenedEvent): Promise<void> {
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
