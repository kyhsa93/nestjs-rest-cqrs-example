import { randomUUID } from 'crypto';

import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { readConnection } from 'libs/database/database-module';

import { AccountEntity } from 'src/account/infrastructure/entity/account-entity';

import { accountByEmail } from './db';

export type TestAccount = {
  id: string;
  email: string;
  password: string;
};

export function basicAuth(id: string, password: string): string {
  return `Basic ${Buffer.from(`${id}:${password}`).toString('base64')}`;
}

export function authOf(account: TestAccount): string {
  return basicAuth(account.id, account.password);
}

/** Opens an account over HTTP and returns its id, which POST /accounts does not. */
export async function openAccount(app: INestApplication): Promise<TestAccount> {
  const email = `e2e-${randomUUID().slice(0, 8)}@example.com`;
  const password = 'password1';
  await request(app.getHttpServer())
    .post('/accounts')
    .send({ name: 'young', email, password })
    .expect(201);

  const entity = await accountByEmail(email);
  if (!entity) throw new Error(`account for ${email} was not stored`);
  return { id: entity.id.toString('hex'), email, password };
}

/** Reads the stored balance, including accounts that have been soft deleted. */
export async function balanceOf(id: string): Promise<number> {
  const entity = await readConnection
    .getRepository(AccountEntity)
    .findOneOrFail({
      where: { id: Buffer.from(id, 'hex') },
      withDeleted: true,
    });
  return entity.balance;
}

export async function deletedAtOf(id: string): Promise<Date | null> {
  const entity = await readConnection
    .getRepository(AccountEntity)
    .findOneOrFail({
      where: { id: Buffer.from(id, 'hex') },
      withDeleted: true,
    });
  return entity.deletedAt;
}
