import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WithdrawnEvent } from 'src/accounts/domain/events/withdrawn.event';

@EventsHandler(WithdrawnEvent)
export class WithdrawnHandler implements IEventHandler<WithdrawnEvent> {
  constructor(readonly logger: Logger) {}

  handle(event: WithdrawnEvent): void {
    this.logger.log(event);
  }
}
