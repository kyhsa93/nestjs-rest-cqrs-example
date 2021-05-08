import Redis from 'ioredis';

import { AppService } from 'src/app.service';

export class CacheAdapter {
  private readonly master: Redis.Redis;

  private readonly slave: Redis.Redis;

  constructor() {
    const { master, slave } = AppService.redisClusterConfig();
    this.master = new Redis(master.port, master.host).on(
      'error',
      this.failToConnectRedis,
    );
    this.slave = new Redis(slave.port, slave.host).on(
      'error',
      this.failToConnectRedis,
    );
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

  private failToConnectRedis(error: Error): Promise<void> {
    console.error(error);
    process.exit(1);
  }
}
