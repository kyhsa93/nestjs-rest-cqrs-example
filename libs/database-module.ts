import { Global, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { getSecret } from 'libs/secret-manager';

import { Config } from 'src/config';

import { AccountEntity } from 'src/account/infrastructure/entity/account-entity';
import { NotificationEntity } from 'src/notification/infrastructure/entities/notification-entity';
import { OutboxEntity } from 'src/outbox/outbox-entity';
import { v4 } from 'uuid';

interface WriteConnection {
  readonly startTransaction: (
    level?:
      | 'READ UNCOMMITTED'
      | 'READ COMMITTED'
      | 'REPEATABLE READ'
      | 'SERIALIZABLE',
  ) => Promise<void>;
  readonly commitTransaction: () => Promise<void>;
  readonly rollbackTransaction: () => Promise<void>;
  readonly isTransactionActive: boolean;
  readonly manager: EntityManager;
}

interface ReadConnection {
  readonly getRepository: <T extends ObjectLiteral>(
    target: EntityTarget<T>,
  ) => Repository<T>;
  readonly query: (query: string) => Promise<void>;
  readonly createQueryBuilder: <Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    alias: string,
    queryRunner?: QueryRunner,
  ) => SelectQueryBuilder<Entity>;
}

export let writeConnection = {} as WriteConnection;
export let readConnection = {} as ReadConnection;

type DatabaseCredentials = Readonly<{ username: string; password: string }>;

class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private dataSource!: DataSource;

  async onModuleInit(): Promise<void> {
    const { username, password } = await this.loadCredentials();
    this.dataSource = new DataSource({
      type: 'mysql',
      entities: [AccountEntity, NotificationEntity, OutboxEntity],
      charset: 'utf8mb4_unicode_ci',
      logging: Config.DATABASE_LOGGING,
      host: Config.DATABASE_HOST,
      port: Config.DATABASE_PORT,
      database: Config.DATABASE_NAME,
      username,
      password,
      synchronize: Config.DATABASE_SYNC,
    });

    await this.dataSource.initialize();
    if (!this.dataSource.isInitialized)
      throw new Error('DataSource is not initialized');
    writeConnection = this.dataSource.createQueryRunner();
    readConnection = this.dataSource.manager;
  }

  async onModuleDestroy(): Promise<void> {
    await this.dataSource?.destroy();
  }

  private async loadCredentials(): Promise<DatabaseCredentials> {
    const raw = await getSecret(Config.DATABASE_SECRET_ID);
    const parsed = JSON.parse(raw) as Partial<DatabaseCredentials>;
    if (!parsed.username || !parsed.password)
      throw new Error(
        `Database secret ${Config.DATABASE_SECRET_ID} is missing username or password`,
      );
    return { username: parsed.username, password: parsed.password };
  }
}

export class EntityId extends String {
  constructor() {
    super(v4().split('-').join(''));
  }
}

export const ENTITY_ID_TRANSFORMER = 'EntityIdTransformer';

export interface EntityIdTransformer {
  from: (dbData: Buffer) => string;
  to: (stringId: string) => Buffer;
}

class EntityIdTransformerImplement implements EntityIdTransformer {
  from(dbData: Buffer): string {
    return Buffer.from(dbData.toString('binary'), 'ascii').toString('hex');
  }

  to(entityData: string): Buffer {
    return Buffer.from(entityData, 'hex');
  }
}

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: ENTITY_ID_TRANSFORMER,
      useClass: EntityIdTransformerImplement,
    },
  ],
  exports: [ENTITY_ID_TRANSFORMER],
})
export class DatabaseModule {}
