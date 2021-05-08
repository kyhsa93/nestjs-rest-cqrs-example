import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { Publisher } from 'src/accounts/application/events/integration';

import { AccountClosedEvent } from 'src/accounts/domain/events/account-closed.event';

@EventsHandler(AccountClosedEvent)
export class AccountClosedHandler implements IEventHandler<AccountClosedEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject('IntegrationEventPublisher') private readonly publisher: Publisher,
  ) {}

  async handle(event: AccountClosedEvent): Promise<void> {
    this.logger.log(`account closed: ${JSON.stringify(event)}`);
    await this.publisher.publish({
      subject: 'account.closed',
      data: { ...event },
    });
  }
}
