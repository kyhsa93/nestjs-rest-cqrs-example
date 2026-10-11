import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { authOf, basicAuth, openAccount } from './support/accounts';
import { createTestApp } from './support/app';
import { clearDatabase } from './support/db';
import { eventually } from './support/eventually';
import { sentEmails } from './support/ses';

// Every event takes two outbox -> SQS hops and OutboxConsumer handles one message per 5 s
// tick, so five events (ten messages) need about a minute. Give this spec a longer budget.
const SPEC_TIMEOUT_MS = 180_000;
const DELIVERY_TIMEOUT_MS = 150_000;

describe('account event emails (e2e)', () => {
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

  it(
    'sends one email for each kind of account event',
    async () => {
      const account = await openAccount(app);
      const server = app.getHttpServer();

      await request(server)
        .post(`/accounts/${account.id}/deposit`)
        .set('Authorization', authOf(account))
        .send({ amount: 500 })
        .expect(201);
      await request(server)
        .post(`/accounts/${account.id}/withdraw`)
        .set('Authorization', authOf(account))
        .send({ amount: 500 })
        .expect(201);
      await request(server)
        .patch(`/accounts/${account.id}/password`)
        .set('Authorization', authOf(account))
        .send({ password: 'newpassword1' })
        .expect(200);
      // The password changed, so the account must now authenticate with the new one.
      await request(server)
        .delete(`/accounts/${account.id}`)
        .set('Authorization', basicAuth(account.id, 'newpassword1'))
        .expect(200);

      const subjects = await eventually(
        async () => {
          const received = (await sentEmails(account.email)).map(
            (email) => email.subject,
          );
          for (const expected of [
            'New account created',
            'Deposited',
            'Withdrawn',
            'Account password updated',
            'Account closed',
          ])
            if (!received.includes(expected))
              throw new Error(
                `missing "${expected}" (got: ${received.join(', ') || 'none'})`,
              );
          return received;
        },
        { timeout: DELIVERY_TIMEOUT_MS, description: 'one email per event' },
      );

      expect(subjects).toHaveLength(5);
    },
    SPEC_TIMEOUT_MS,
  );
});
