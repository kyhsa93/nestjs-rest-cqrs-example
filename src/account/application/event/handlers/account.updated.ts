import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import IntegrationEvent from '@src/account/application/event/implements/account.updated';
import { Publisher } from '@src/account/application/event/publisher';

import AccountUpdatedDomainEvent from '@src/account/domain/event/account.updated';

const MESSAGE_KEY = 'account.updated';

@EventsHandler(AccountUpdatedDomainEvent)
export default class AccountUpdatedDomainEventHandler
  implements IEventHandler<AccountUpdatedDomainEvent> {
  constructor(@Inject('IntegrationEventPublisher') private readonly publisher: Publisher) {}

  public async handle(event: AccountUpdatedDomainEvent): Promise<void> {
    const integrationEvent = new IntegrationEvent(MESSAGE_KEY, event);
    await this.publisher.publish(integrationEvent);
  }
}
