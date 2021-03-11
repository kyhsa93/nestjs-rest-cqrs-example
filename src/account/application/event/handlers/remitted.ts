import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import RemittedIntegrationEvent from "@src/account/application/event/implements/remitted";


import { Publisher } from "@src/account/application/event/publisher";

import RemittedDomainEvent from "@src/account/domain/event/remitted";

const MESSAGE_KEY = 'remitted';

@EventsHandler(RemittedDomainEvent)
export default class RemittedDomainEventHandler implements IEventHandler<RemittedDomainEvent>{
  constructor(@Inject('IntegrationEventPublisher') private readonly publisher: Publisher){}

  public async handle(event: RemittedDomainEvent): Promise<void> {
    const integrationEvent = new RemittedIntegrationEvent(MESSAGE_KEY, event);
    await this.publisher.publish(integrationEvent);
  }
}
