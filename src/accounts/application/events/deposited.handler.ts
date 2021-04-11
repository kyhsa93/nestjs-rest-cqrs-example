import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DepositedEvent } from 'src/accounts/domain/events/deposited.event';

@EventsHandler(DepositedEvent)
export class DepositedHandler implements IEventHandler<DepositedEvent> {
  constructor(readonly logger: Logger) {}

  handle(event: DepositedEvent): void {
    this.logger.log(event);
  }
}
