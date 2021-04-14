import Redis from 'ioredis';

import { AppService } from 'src/app.service';

export default class RedisAdapter {
  private readonly master: Redis.Redis;

  private readonly slave: Redis.Redis;

  constructor() {
    const { master, slave } = AppService.redisClusterConfig();
    this.master = new Redis(master.port, master.host);
    this.slave = new Redis(slave.port, slave.host);
  }

  public async set(key: string, value: string): Promise<void> {
    await this.master.set(key, value, 'EX', 1);
  }

  public async get(key: string): Promise<string | null> {
    return this.slave
      .get(key)
      .then((result) => result)
      .catch(() => null);
  }
}
