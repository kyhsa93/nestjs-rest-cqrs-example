import { FindNotificationQuery } from 'src/notification/application/query/FindNotificationQuery';
import { FindNotificationResult } from 'src/notification/application/query/FindNotificationResult';

export interface NotificationQuery {
  find: (options: FindNotificationQuery) => Promise<FindNotificationResult>;
}
