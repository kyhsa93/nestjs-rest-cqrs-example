import { readConnection } from 'libs/database/database-module';

import { AccountEntity } from 'src/account/infrastructure/entity/account-entity';
import { NotificationEntity } from 'src/notification/infrastructure/entities/notification-entity';
import { OutboxEntity } from 'src/outbox/outbox-entity';

/**
 * Tests read and clean through `readConnection` (the pooled DataSource manager).
 * `writeConnection` is a single QueryRunner that the app uses for its transactions,
 * so queries issued on it from a test could end up inside one.
 */
export async function clearDatabase(): Promise<void> {
  await readConnection.getRepository(OutboxEntity).clear();
  await readConnection.getRepository(NotificationEntity).clear();
  await readConnection.getRepository(AccountEntity).clear();
}

export function accountByEmail(email: string): Promise<AccountEntity | null> {
  return readConnection.getRepository(AccountEntity).findOneBy({ email });
}

export function outboxRowsContaining(text: string): Promise<OutboxEntity[]> {
  return readConnection
    .getRepository(OutboxEntity)
    .createQueryBuilder('outbox')
    .where('outbox.payload LIKE :text', { text: `%${text}%` })
    .orderBy('outbox.createdAt', 'ASC')
    .getMany();
}

export function notificationsTo(to: string): Promise<NotificationEntity[]> {
  return readConnection.getRepository(NotificationEntity).findBy({ to });
}
