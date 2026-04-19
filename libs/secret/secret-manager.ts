import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

import { Config } from 'src/config';

const TTL_MS = 5 * 60 * 1000;

const client = new SecretsManagerClient({
  region: Config.AWS_REGION,
  endpoint: Config.AWS_ENDPOINT,
});

const cache = new Map<string, { value: string; expiresAt: number }>();

export async function getSecret(secretId: string): Promise<string> {
  const cached = cache.get(secretId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const result = await client.send(
    new GetSecretValueCommand({ SecretId: secretId }),
  );
  const value = result.SecretString ?? '';
  cache.set(secretId, { value, expiresAt: Date.now() + TTL_MS });
  return value;
}
