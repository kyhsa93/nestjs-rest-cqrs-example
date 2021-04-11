import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PasswordUpdatedEvent } from 'src/accounts/domain/events/password-updated.event';

@EventsHandler(PasswordUpdatedEvent)
export class PasswordUpdatedHandler
  implements IEventHandler<PasswordUpdatedEvent> {
  constructor(readonly logger: Logger) {}

  handle(event: PasswordUpdatedEvent): void {
    this.logger.log(event);
  }
}
