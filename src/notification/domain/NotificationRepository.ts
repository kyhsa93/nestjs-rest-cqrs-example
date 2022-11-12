import { Notification } from 'src/notification/domain/Notification';

export interface NotificationRepository {
  newId: () => string;
  save: (notification: Notification) => Promise<void>;
}
