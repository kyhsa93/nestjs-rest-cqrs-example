import { connect } from 'net';

import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { ListIdentitiesCommand, SESClient } from '@aws-sdk/client-ses';
import { GetQueueUrlCommand, SQSClient } from '@aws-sdk/client-sqs';

import './env';

const TIMEOUT_MS = 120_000;
const INTERVAL_MS = 1_000;

async function waitFor(name: string, check: () => Promise<boolean>) {
  const deadline = Date.now() + TIMEOUT_MS;
  let lastError: unknown;
  while (Date.now() < deadline) {
    try {
      if (await check()) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));
  }
  throw new Error(
    `e2e setup: ${name} was not ready after ${TIMEOUT_MS / 1000}s${
      lastError ? ` (${String(lastError)})` : ''
    }`,
  );
}

function canConnect(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = connect({ host, port });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

/**
 * docker compose reports LocalStack healthy before `.aws/localstack.sh` has finished,
 * so wait for the resources that script creates, not just for the port.
 */
export default async function globalSetup(): Promise<void> {
  const clientConfig = {
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
  };

  await waitFor('MySQL', () =>
    canConnect(
      process.env.DATABASE_HOST as string,
      Number(process.env.DATABASE_PORT),
    ),
  );

  const secrets = new SecretsManagerClient(clientConfig);
  await waitFor('secret nest/database', async () => {
    const result = await secrets.send(
      new GetSecretValueCommand({ SecretId: process.env.DATABASE_SECRET_ID }),
    );
    return Boolean(result.SecretString);
  });

  const sqs = new SQSClient(clientConfig);
  for (const queueName of ['example', 'domain-events']) {
    await waitFor(`SQS queue ${queueName}`, async () => {
      const result = await sqs.send(
        new GetQueueUrlCommand({ QueueName: queueName }),
      );
      return Boolean(result.QueueUrl);
    });
  }

  const ses = new SESClient(clientConfig);
  await waitFor(`SES sender ${process.env.EMAIL}`, async () => {
    const result = await ses.send(
      new ListIdentitiesCommand({ IdentityType: 'EmailAddress' }),
    );
    return (result.Identities ?? []).includes(process.env.EMAIL as string);
  });
}
