import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import {
  Notification,
  NotificationProperties,
} from 'src/notification/domain/Notification';

export type CreateNotificationOptions = Omit<
  NotificationProperties,
  'createdAt'
>;

export class NotificationFactory {
  @Inject() private readonly eventPublisher: EventPublisher;

  create(options: CreateNotificationOptions): Notification {
    return this.eventPublisher.mergeObjectContext(
      new Notification({ ...options, createdAt: new Date() }),
    );
  }

  reconstitute(properties: NotificationProperties): Notification {
    return this.eventPublisher.mergeObjectContext(new Notification(properties));
  }
}
