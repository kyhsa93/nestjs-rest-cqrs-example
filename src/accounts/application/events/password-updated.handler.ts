import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Publisher } from 'src/accounts/application/events/integration';
import { PasswordUpdatedEvent } from 'src/accounts/domain/events/password-updated.event';

@EventsHandler(PasswordUpdatedEvent)
export class PasswordUpdatedHandler
  implements IEventHandler<PasswordUpdatedEvent> {
  constructor(
    readonly logger: Logger,
    @Inject('IntegrationEventPublisher') readonly publisher: Publisher,
  ) {}

  async handle(event: PasswordUpdatedEvent): Promise<void> {
    this.logger.log(event);
    await this.publisher.publish({
      subject: 'password.updated',
      data: { ...event },
    });
  }
}
