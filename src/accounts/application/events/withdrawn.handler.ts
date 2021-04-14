import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Publisher } from 'src/accounts/application/events/integration';
import { WithdrawnEvent } from 'src/accounts/domain/events/withdrawn.event';

@EventsHandler(WithdrawnEvent)
export class WithdrawnHandler implements IEventHandler<WithdrawnEvent> {
  constructor(
    readonly logger: Logger,
    @Inject('IntegrationEventPublisher') readonly publisher: Publisher,
  ) {}

  async handle(event: WithdrawnEvent): Promise<void> {
    this.logger.log(event);
    await this.publisher.publish({
      subject: 'password.updated',
      data: { ...event },
    });
  }
}
