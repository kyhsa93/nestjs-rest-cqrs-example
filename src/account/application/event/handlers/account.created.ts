import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import IntegrationEvent from '@src/account/application/event/implements/account.created';
import { Publisher } from '@src/account/application/event/publisher';

import AccountCreatedDomainEvent from '@src/account/domain/event/account.created';

const MESSAGE_KEY = 'account.created';

@EventsHandler(AccountCreatedDomainEvent)
export default class AccountCreatedDomainEventHandler
implements IEventHandler<AccountCreatedDomainEvent> {
  constructor(
    @Inject('IntegrationEventPublisher') private readonly publisher: Publisher,
  ) {}

  public async handle(event: AccountCreatedDomainEvent): Promise<void> {
    const integrationEvent = new IntegrationEvent(MESSAGE_KEY, event);
    await this.publisher.publish(integrationEvent);
  }
}
