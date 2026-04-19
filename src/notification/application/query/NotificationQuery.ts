import { FindNotificationQuery } from 'src/notification/application/query/FindNotificationQuery';
import { FindNotificationResult } from 'src/notification/application/query/FindNotificationResult';

export abstract class NotificationQuery {
  abstract find(
    options: FindNotificationQuery,
  ): Promise<FindNotificationResult>;
}
