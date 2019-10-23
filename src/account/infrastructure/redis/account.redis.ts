import Redis from 'ioredis';
import AppConfiguration from '../../../app.config';

export default class AccountRedis {
  private readonly redis: Redis.Redis;

  constructor() {
    this.redis = new Redis(AppConfiguration.REDIS_PORT, AppConfiguration.REDIS_HOST);
  }

  async set(key: string, value: string): Promise<string> {
    return this.redis.set(key, value, 'EX', 1);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key).then(result => result).catch(() => null);
  }
}
