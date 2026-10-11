import { randomUUID } from 'crypto';

import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { ErrorCode } from 'src/account/domain/error-code';

import {
  authOf,
  balanceOf,
  basicAuth,
  deletedAtOf,
  openAccount,
  TestAccount,
} from './support/accounts';
import { createTestApp } from './support/app';
import { clearDatabase, outboxRowsContaining } from './support/db';

describe('money movement and access rules (e2e)', () => {
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

  function post(account: TestAccount, path: string, body: object) {
    return request(app.getHttpServer())
      .post(`/accounts/${account.id}/${path}`)
      .set('Authorization', authOf(account))
      .send(body);
  }

  it('deposits, withdraws and remits between two accounts', async () => {
    const sender = await openAccount(app);
    const receiver = await openAccount(app);

    await post(sender, 'deposit', { amount: 1000 }).expect(201);
    await post(sender, 'withdraw', { amount: 300 }).expect(201);
    expect(await balanceOf(sender.id)).toBe(700);

    await post(sender, 'remit', {
      receiverId: receiver.id,
      amount: 200,
    }).expect(201);
    expect(await balanceOf(sender.id)).toBe(500);
    expect(await balanceOf(receiver.id)).toBe(200);
  });

  it('refuses to withdraw more than the balance and leaves no state or event behind', async () => {
    const account = await openAccount(app);
    await post(account, 'deposit', { amount: 100 }).expect(201);

    const response = await post(account, 'withdraw', { amount: 500 }).expect(
      422,
    );

    expect((response.body as { code: string }).code).toBe(
      ErrorCode.REQUESTED_AMOUNT_EXCEEDS_YOUR_WITHDRAWAL_LIMIT,
    );
    expect(await balanceOf(account.id)).toBe(100);
    const eventTypes = (await outboxRowsContaining(account.email)).map(
      (row) => row.eventType,
    );
    expect(eventTypes).toContain('DepositedEvent');
    expect(eventTypes).not.toContain('WithdrawnEvent');
  });

  it('refuses a remittance that cannot be completed and moves no money', async () => {
    const sender = await openAccount(app);
    const receiver = await openAccount(app);
    await post(sender, 'deposit', { amount: 100 }).expect(201);

    await post(sender, 'remit', { receiverId: sender.id, amount: 10 }).expect(
      422,
    );
    await post(sender, 'remit', {
      receiverId: receiver.id,
      amount: 500,
    }).expect(422);
    await post(sender, 'remit', {
      receiverId: randomUUID().replace(/-/g, ''),
      amount: 10,
    }).expect(404);

    expect(await balanceOf(sender.id)).toBe(100);
    expect(await balanceOf(receiver.id)).toBe(0);
  });

  it('rejects requests without valid credentials or for another account', async () => {
    const owner = await openAccount(app);
    const stranger = await openAccount(app);
    const url = `/accounts/${owner.id}/deposit`;

    await request(app.getHttpServer())
      .post(url)
      .send({ amount: 10 })
      .expect(403);
    await request(app.getHttpServer())
      .post(url)
      .set('Authorization', basicAuth(owner.id, 'wrongpassword1'))
      .send({ amount: 10 })
      .expect(403);
    // Valid credentials, but for a different account than the one in the path.
    await post(stranger, 'deposit', { amount: 10 }).expect(201);
    await request(app.getHttpServer())
      .post(url)
      .set('Authorization', authOf(stranger))
      .send({ amount: 10 })
      .expect(404);

    expect(await balanceOf(owner.id)).toBe(0);
  });

  it('closes only an account with no balance left', async () => {
    const account = await openAccount(app);
    await post(account, 'deposit', { amount: 100 }).expect(201);
    const close = () =>
      request(app.getHttpServer())
        .delete(`/accounts/${account.id}`)
        .set('Authorization', authOf(account));

    const refused = await close().expect(422);
    expect((refused.body as { code: string }).code).toBe(
      ErrorCode.ACCOUNT_BALANCE_IS_REMAINED,
    );
    expect(await deletedAtOf(account.id)).toBeNull();

    await post(account, 'withdraw', { amount: 100 }).expect(201);
    await close().expect(200);
    expect(await deletedAtOf(account.id)).not.toBeNull();
  });
});
