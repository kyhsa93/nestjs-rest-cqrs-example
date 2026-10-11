import { randomUUID } from 'crypto';

import { INestApplication } from '@nestjs/common';

import { createTestApp } from './support/app';
import { clearDatabase } from './support/db';
import { eventually } from './support/eventually';
import { sendOutboxMessage } from './support/queue';
import { sentEmails } from './support/ses';

const WELCOME = 'New account created';

function newEmail(): string {
  return `e2e-${randomUUID().slice(0, 8)}@example.com`;
}

function accountOpened(email: string) {
  return {
    eventId: randomUUID().replace(/-/g, ''),
    eventType: 'AccountOpened',
    payload: { accountId: randomUUID().replace(/-/g, ''), email },
  };
}

async function welcomeEmailCount(email: string): Promise<number> {
  return (await sentEmails(email)).filter((mail) => mail.subject === WELCOME)
    .length;
}

describe('outbox delivery semantics (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it('skips a message with an unknown event type and keeps consuming the queue', async () => {
    const email = newEmail();
    await sendOutboxMessage({
      eventId: randomUUID().replace(/-/g, ''),
      eventType: 'NoSuchEvent',
      payload: {},
    });
    await sendOutboxMessage(accountOpened(email));

    await eventually(
      async () => {
        if ((await welcomeEmailCount(email)) < 1)
          throw new Error('no welcome email yet');
      },
      { description: 'welcome email after an unknown event' },
    );
    expect(await welcomeEmailCount(email)).toBe(1);
  });

  // Characterization test: it records what the system does today, not what it should do.
  // Delivery through SQS is at-least-once, and nothing in OutboxConsumer, EventHandlerRegistry
  // or the notification context de-duplicates by eventId, so a redelivered message sends the
  // email again. When idempotency is added, change the expected count to 1.
  it('sends the email again when the same message is delivered twice (no idempotency yet)', async () => {
    const email = newEmail();
    const message = accountOpened(email);
    await sendOutboxMessage(message);
    await sendOutboxMessage(message);

    await eventually(
      async () => {
        const count = await welcomeEmailCount(email);
        if (count < 2) throw new Error(`${count} welcome email(s) so far`);
      },
      { description: 'both deliveries handled' },
    );
    // Wait out a couple of consumer ticks to show it settles at two and not more.
    await new Promise((resolve) => setTimeout(resolve, 11_000));
    expect(await welcomeEmailCount(email)).toBe(2);
  });
});
