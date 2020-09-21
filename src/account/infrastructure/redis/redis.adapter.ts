import Redis from 'ioredis';

import AppConfiguration from '@src/app.config';

export default class RedisAdapter {
  private readonly master: Redis.Redis;

  private readonly slave: Redis.Redis;

  constructor() {
    this.master = new Redis(AppConfiguration.REDIS_MASTER_PORT, AppConfiguration.REDIS_MASTER_HOST);
    this.slave = new Redis(AppConfiguration.REDIS_SLAVE_PORT, AppConfiguration.REDIS_SLAVE_HOST);
  }

  async set(key: string, value: string): Promise<void> {
    await this.master.set(key, value, 'EX', 1);
  }

  async get(key: string): Promise<string | null> {
    return this.slave
      .get(key)
      .then((result) => result)
      .catch(() => null);
  }
}
