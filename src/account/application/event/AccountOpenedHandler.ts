import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  AccountOpened,
  IntegrationEventPublisher,
  INTEGRATION_EVENT_PUBLISHER,
  Topic,
} from 'libs/MessageModule';
import { Transactional } from 'libs/Transactional';

import { AccountOpenedEvent } from 'src/account/domain/event/AccountOpenedEvent';

@EventsHandler(AccountOpenedEvent)
export class AccountOpenedHandler implements IEventHandler<AccountOpenedEvent> {
  @Inject(INTEGRATION_EVENT_PUBLISHER)
  private readonly integrationEventPublisher: IntegrationEventPublisher;

  @Transactional()
  async handle(event: AccountOpenedEvent): Promise<void> {
    await this.integrationEventPublisher.publish(
      Topic.ACCOUNT_OPENED,
      new AccountOpened(event.accountId, event.email),
    );
  }
}
