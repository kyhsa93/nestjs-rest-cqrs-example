import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  AccountClosed,
  IntegrationEventPublisher,
  INTEGRATION_EVENT_PUBLISHER,
  Topic,
} from 'libs/MessageModule';
import { Transactional } from 'libs/Transactional';

import { AccountClosedEvent } from 'src/account/domain/event/AccountClosedEvent';

@EventsHandler(AccountClosedEvent)
export class AccountClosedHandler implements IEventHandler<AccountClosedEvent> {
  @Inject(INTEGRATION_EVENT_PUBLISHER)
  private readonly integrationEventPublisher: IntegrationEventPublisher;

  @Transactional()
  async handle(event: AccountClosedEvent): Promise<void> {
    await this.integrationEventPublisher.publish(
      Topic.ACCOUNT_CLOSED,
      new AccountClosed(event.accountId, event.email),
    );
  }
}
