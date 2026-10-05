import { Inject } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

import {
  EntityIdTransformer,
  ENTITY_ID_TRANSFORMER,
  readConnection,
} from 'libs/database/database-module';

import { NotificationEntity } from 'src/notification/infrastructure/entities/notification-entity';

import { FindNotificationQuery } from 'src/notification/application/query/find-notification-query';
import { FindNotificationResult } from 'src/notification/application/query/find-notification-result';
import { NotificationQuery } from 'src/notification/application/query/notification-query';

export class NotificationQueryImplement extends NotificationQuery {
  @Inject(ENTITY_ID_TRANSFORMER)
  private readonly entityIdTransformer: EntityIdTransformer;

  find(options: FindNotificationQuery): Promise<FindNotificationResult> {
    const where: FindOptionsWhere<NotificationEntity> = {};
    if (options.to) where.to = options.to;
    if (options.accountId)
      where.accountId = this.entityIdTransformer.to(options.accountId);

    return readConnection
      .getRepository(NotificationEntity)
      .find({ skip: options.skip, take: options.take, where })
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
