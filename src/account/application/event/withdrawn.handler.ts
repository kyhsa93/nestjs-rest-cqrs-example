import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  EventStore,
  IntegrationEventPublisher,
  IntegrationEventSubject,
} from 'src/account/application/event/integration';
import { InjectionToken } from 'src/account/application/injection.token';

import { WithdrawnEvent } from 'src/account/domain/event/withdrawn.event';

@EventsHandler(WithdrawnEvent)
export class WithdrawnHandler implements IEventHandler<WithdrawnEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject(InjectionToken.INTEGRATION_EVENT_PUBLISHER)
    private readonly publisher: IntegrationEventPublisher,
    @Inject(InjectionToken.EVENT_STORE) private readonly eventStore: EventStore,
  ) {}

  async handle(event: WithdrawnEvent): Promise<void> {
    this.logger.log(
      `${IntegrationEventSubject.WITHDRAWN}: ${JSON.stringify(event)}`,
    );
    await this.publisher.publish({
      subject: IntegrationEventSubject.WITHDRAWN,
      data: { id: event.id },
    });
    await this.eventStore.save({
      subject: IntegrationEventSubject.WITHDRAWN,
      data: event,
    });
  }
}
