import { Inject } from '@nestjs/common';

import {
  EntityIdTransformer,
  ENTITY_ID_TRANSFORMER,
  readConnection,
} from 'libs/DatabaseModule';

import { NotificationEntity } from 'src/notification/infrastructure/entities/NotificationEntity';

import { FindNotificationQuery } from 'src/notification/application/query/FindNotificationQuery';
import { FindNotificationResult } from 'src/notification/application/query/FindNotificationResult';
import { NotificationQuery } from 'src/notification/application/query/NotificationQuery';

export class NotificationQueryImplement implements NotificationQuery {
  @Inject(ENTITY_ID_TRANSFORMER)
  private readonly entityIdTransformer: EntityIdTransformer;

  find(options: FindNotificationQuery): Promise<FindNotificationResult> {
    return readConnection
      .getRepository(NotificationEntity)
      .find({
        ...options,
        where: {
          to: options.to,
          accountId: options.accountId
            ? this.entityIdTransformer.to(options.accountId)
            : undefined,
        },
      })
      .then((entities) => ({
        notifications: entities.map((entity) => ({
          id: this.entityIdTransformer.from(entity.id),
          to: entity.to,
          subject: entity.subject,
          content: entity.content,
          createdAt: entity.createdAt,
        })),
      }));
  }
}
