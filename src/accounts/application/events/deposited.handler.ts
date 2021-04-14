import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Publisher } from 'src/accounts/application/events/integration';
import { DepositedEvent } from 'src/accounts/domain/events/deposited.event';

@EventsHandler(DepositedEvent)
export class DepositedHandler implements IEventHandler<DepositedEvent> {
  constructor(
    readonly logger: Logger,
    @Inject('IntegrationEventPublisher') readonly publisher: Publisher,
  ) {}

  async handle(event: DepositedEvent): Promise<void> {
    this.logger.log(event);
    await this.publisher.publish({ subject: 'deposited', data: { ...event } });
  }
}
