import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import IntegrationEventPublisher from '@src/account/infrastructure/message/publisher';

import AccountCreatedIntegrationEvent from '@src/account/application/event/implements/account.created.integration';

import AccountCreatedDomainEvent from '@src/account/domain/event/account.created';

@EventsHandler(AccountCreatedDomainEvent)
export default class AccountCreatedDomainEventHandler
implements IEventHandler<AccountCreatedDomainEvent> {
  constructor(
    @Inject(IntegrationEventPublisher)
    private readonly integrationEventPublisher: IntegrationEventPublisher,
  ) {}

  public async handle(event: AccountCreatedDomainEvent): Promise<void> {
    const messageKey = 'account.created';
    const data = JSON.stringify(event);
    const integrationEvent = new AccountCreatedIntegrationEvent(messageKey, data);
    await this.integrationEventPublisher.publish(integrationEvent);
  }
}
