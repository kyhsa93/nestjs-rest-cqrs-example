import { Injectable } from '@nestjs/common';

import { EntityId, writeConnection } from 'libs/DatabaseModule';

import { OutboxEntity } from 'src/outbox/OutboxEntity';

@Injectable()
export class OutboxWriter {
  async saveAll(events: object[]): Promise<void> {
    if (events.length === 0) return;
    const rows = events.map((event) => ({
      eventId: new EntityId().toString(),
      eventType: event.constructor.name,
      payload: JSON.stringify(event),
      processed: false,
    }));
    await writeConnection.manager.getRepository(OutboxEntity).save(rows);
  }
}
