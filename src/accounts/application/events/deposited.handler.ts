import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Publisher } from 'src/accounts/application/events/integration';
import { DepositedEvent } from 'src/accounts/domain/events/deposited.event';

@EventsHandler(DepositedEvent)
export class DepositedHandler implements IEventHandler<DepositedEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject('IntegrationEventPublisher') private readonly publisher: Publisher,
  ) {}

  async handle(event: DepositedEvent): Promise<void> {
    this.logger.log(`account deposited: ${JSON.stringify(event)}`);
    await this.publisher.publish({ subject: 'deposited', data: { ...event } });
  }
}
