import {
  Notification,
  NotificationProperties,
} from 'src/notification/domain/Notification';

export type CreateNotificationOptions = Omit<
  NotificationProperties,
  'createdAt'
>;

export class NotificationFactory {
  create(options: CreateNotificationOptions): Notification {
    return new Notification({ ...options, createdAt: new Date() });
  }

  reconstitute(properties: NotificationProperties): Notification {
    return new Notification(properties);
  }
}
