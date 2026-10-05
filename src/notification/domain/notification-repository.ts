import { Notification } from 'src/notification/domain/notification';

export abstract class NotificationRepository {
  abstract newId(): string;
  abstract saveNotification(notification: Notification): Promise<void>;
}
