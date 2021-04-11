import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccountClosedEvent } from 'src/accounts/domain/events/account-closed.event';

@EventsHandler(AccountClosedEvent)
export class AccountClosedHandler implements IEventHandler<AccountClosedEvent> {
  constructor(readonly logger: Logger) {}

  handle(event: AccountClosedEvent): void {
    this.logger.log(event);
  }
}
