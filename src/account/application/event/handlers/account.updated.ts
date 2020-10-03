import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import IntegrationEventPublisher from '@src/account/infrastructure/message/publisher';

import AccountUpdatedIntegrationEvent from '@src/account/application/event/implements/account.updated';

import AccountUpdatedDomainEvent from '@src/account/domain/event/account.updated';

@EventsHandler(AccountUpdatedDomainEvent)
export default class AccountUpdatedDomainEventHandler
implements IEventHandler<AccountUpdatedDomainEvent> {
  constructor(
    @Inject(IntegrationEventPublisher)
    private readonly integrationEventPublisher: IntegrationEventPublisher,
  ) {}

  public async handle(event: AccountUpdatedDomainEvent): Promise<void> {
    const messageKey = 'account.updated';
    const data = JSON.stringify(event);
    const integrationEvent = new AccountUpdatedIntegrationEvent(messageKey, data);
    await this.integrationEventPublisher.publish(integrationEvent);
  }
}
