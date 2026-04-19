import { Inject } from '@nestjs/common';

import {
  EntityId,
  EntityIdTransformer,
  ENTITY_ID_TRANSFORMER,
  writeConnection,
} from 'libs/DatabaseModule';

import { NotificationEntity } from 'src/notification/infrastructure/entities/NotificationEntity';
import { OutboxWriter } from 'src/outbox/OutboxWriter';

import {
  Notification,
  NotificationProperties,
} from 'src/notification/domain/Notification';
import { NotificationRepository } from 'src/notification/domain/NotificationRepository';

export class NotificationRepositoryImplement extends NotificationRepository {
  @Inject(ENTITY_ID_TRANSFORMER)
  private readonly entityIdTransformer: EntityIdTransformer;
  @Inject() private readonly outboxWriter: OutboxWriter;

  newId(): string {
    return new EntityId().toString();
  }

  async save(notification: Notification): Promise<void> {
    await writeConnection.manager
      .getRepository(NotificationEntity)
      .save(this.modelToEntity(notification));

    const events = [...notification.domainEvents];
    if (events.length > 0) {
      await this.outboxWriter.saveAll(events);
      notification.clearEvents();
    }
  }

  private modelToEntity(model: Notification): NotificationEntity {
    const properties = JSON.parse(
      JSON.stringify(model),
    ) as NotificationProperties;
    return Object.assign(new NotificationEntity(), {
      ...properties,
      id: this.entityIdTransformer.to(properties.id),
      accountId: this.entityIdTransformer.to(properties.accountId),
    });
  }
}
