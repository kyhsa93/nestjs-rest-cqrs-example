import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import IntegrationEvent from '@src/account/application/event/implements/account.opened';
import { Publisher } from '@src/account/application/event/publisher';

import AccountOpenedDomainEvent from '@src/account/domain/event/account.opened';

const MESSAGE_KEY = 'account.opened';

@EventsHandler(AccountOpenedDomainEvent)
export default class AccountOpenedDomainEventHandler
  implements IEventHandler<AccountOpenedDomainEvent> {
  constructor(@Inject('IntegrationEventPublisher') private readonly publisher: Publisher) {}

  public async handle(event: AccountOpenedDomainEvent): Promise<void> {
    const integrationEvent = new IntegrationEvent(MESSAGE_KEY, event);
    await this.publisher.publish(integrationEvent);
  }
}
