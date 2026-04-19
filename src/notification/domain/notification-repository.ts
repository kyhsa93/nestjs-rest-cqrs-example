import { Notification } from 'src/notification/domain/notification';

export abstract class NotificationRepository {
  abstract newId(): string;
  abstract save(notification: Notification): Promise<void>;
}
