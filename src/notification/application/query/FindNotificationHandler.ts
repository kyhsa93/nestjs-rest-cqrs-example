import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FindNotificationQuery } from 'src/notification/application/query/FindNotificationQuery';
import { FindNotificationResult } from 'src/notification/application/query/FindNotificationResult';
import { NotificationQuery } from 'src/notification/application/query/NotificationQuery';

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
