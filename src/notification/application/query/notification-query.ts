import { FindNotificationQuery } from 'src/notification/application/query/find-notification-query';
import { FindNotificationResult } from 'src/notification/application/query/find-notification-result';

export abstract class NotificationQuery {
  abstract find(
    options: FindNotificationQuery,
  ): Promise<FindNotificationResult>;
}
