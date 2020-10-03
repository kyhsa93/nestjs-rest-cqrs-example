import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import AccountDeletedIntegrationEvent from '@src/account/application/event/implements/account.deleted';
import AccountDeletedDomainEvent from '@src/account/domain/event/account.deleted';
import IntegrationEventPublisher from '@src/account/infrastructure/message/publisher';

@EventsHandler(AccountDeletedDomainEvent)
export default class AccountDeletedDomainEventHandler
implements IEventHandler<AccountDeletedDomainEvent> {
  constructor(
    @Inject(IntegrationEventPublisher)
    private readonly integrationEventPublisher: IntegrationEventPublisher,
  ) {}

  public async handle(event: AccountDeletedDomainEvent): Promise<void> {
    const messageKey = 'account.deleted';
    const data = JSON.stringify(event);
    const integrationEvent = new AccountDeletedIntegrationEvent(messageKey, data);
    await this.integrationEventPublisher.publish(integrationEvent);
  }
}
