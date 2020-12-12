import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import IntegrationEvent from '@src/account/application/event/implements/account.deleted';
import { Publisher } from '@src/account/application/event/publisher';

import AccountDeletedDomainEvent from '@src/account/domain/event/account.deleted';

const MESSAGE_KEY = 'account.deleted';

@EventsHandler(AccountDeletedDomainEvent)
export default class AccountDeletedDomainEventHandler
  implements IEventHandler<AccountDeletedDomainEvent> {
  constructor(@Inject('IntegrationEventPublisher') private readonly publisher: Publisher) {}

  public async handle(event: AccountDeletedDomainEvent): Promise<void> {
    const integrationEvent = new IntegrationEvent(MESSAGE_KEY, event);
    await this.publisher.publish(integrationEvent);
  }
}
