import { randomUUID } from 'crypto';

import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from './support/app';
import {
  accountByEmail,
  clearDatabase,
  notificationsTo,
  outboxRowsContaining,
} from './support/db';
import { eventually } from './support/eventually';
import { sentEmails } from './support/ses';

type NotificationsBody = { notifications: { subject: string; to: string }[] };

describe('account lifecycle (e2e)', () => {
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

  it('opens an account and emails its owner through the outbox and SQS', async () => {
    const email = `e2e-${randomUUID().slice(0, 8)}@example.com`;

    await request(app.getHttpServer())
      .post('/accounts')
      .send({ name: 'young', email, password: 'password1' })
      .expect(201);

    // The account row and the domain event row are committed by the same command.
    const account = await accountByEmail(email);
    expect(account).not.toBeNull();
    const accountId = (account as { id: Buffer }).id.toString('hex');
    const outboxRows = await outboxRowsContaining(email);
    expect(outboxRows.map((row) => row.eventType)).toContain(
      'AccountOpenedEvent',
    );

    // The event then travels outbox -> SQS -> consumer twice (domain event, then the
    // integration event) before the notification context sends the email.
    const welcome = await eventually(
      async () => {
        const emails = await sentEmails(email);
        const found = emails.find(
          (mail) => mail.subject === 'New account created',
        );
        if (!found)
          throw new Error(
            `no welcome email yet (${emails.length} email(s) for ${email})`,
          );
        return found;
      },
      { description: 'welcome email in LocalStack SES' },
    );
    expect(welcome.to).toEqual([email]);

    const notifications = await notificationsTo(email);
    expect(notifications.map((notification) => notification.subject)).toContain(
      'New account created',
    );

    // Query it back over HTTP. The endpoint is cached, so this is asked once, at the end.
    const response = await request(app.getHttpServer())
      .get(`/accounts/${accountId}/notifications`)
      .expect(200);
    expect(
      (response.body as NotificationsBody).notifications.map(
        (notification) => notification.subject,
      ),
    ).toContain('New account created');
  });

  it('rejects an invalid request and leaves nothing behind', async () => {
    const email = 'not-an-email';

    await request(app.getHttpServer())
      .post('/accounts')
      .send({ name: 'young', email, password: 'password1' })
      .expect(400);

    expect(await accountByEmail(email)).toBeNull();
    expect(await outboxRowsContaining(email)).toHaveLength(0);
  });
});
