import Redis from 'ioredis';

import AppConfiguration from '@src/app.config';

export default class RedisAdapter {
  private readonly master: Redis.Redis;

  private readonly slave: Redis.Redis;

  constructor() {
    this.master = new Redis(AppConfiguration.redis.master.port, AppConfiguration.redis.master.host);
    this.slave = new Redis(AppConfiguration.redis.slave.port, AppConfiguration.redis.master.host);
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
