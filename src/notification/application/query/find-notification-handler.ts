import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FindNotificationQuery } from 'src/notification/application/query/find-notification-query';
import { FindNotificationResult } from 'src/notification/application/query/find-notification-result';
import { NotificationQuery } from 'src/notification/application/query/notification-query';

@QueryHandler(FindNotificationQuery)
export class FindNotificationHandler implements IQueryHandler<
  FindNotificationQuery,
  FindNotificationResult
> {
  constructor(private readonly notificationQuery: NotificationQuery) {}

  execute(query: FindNotificationQuery): Promise<FindNotificationResult> {
    return this.notificationQuery.find(query);
  }
}
