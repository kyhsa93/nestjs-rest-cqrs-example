import { Notification } from 'src/notification/domain/Notification';

export abstract class NotificationRepository {
  abstract newId(): string;
  abstract save(notification: Notification): Promise<void>;
}
