import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import IntegrationEvent from '@src/account/application/event/implements/account.closed';
import { Publisher } from '@src/account/application/event/publisher';

import AccountClosedDomainEvent from '@src/account/domain/event/account.closed';

const MESSAGE_KEY = 'account.closed';

@EventsHandler(AccountClosedDomainEvent)
export default class AccountClosedDomainEventHandler
  implements IEventHandler<AccountClosedDomainEvent> {
  constructor(@Inject('IntegrationEventPublisher') private readonly publisher: Publisher) {}

  public async handle(event: AccountClosedDomainEvent): Promise<void> {
    const integrationEvent = new IntegrationEvent(MESSAGE_KEY, event);
    await this.publisher.publish(integrationEvent);
  }
}
