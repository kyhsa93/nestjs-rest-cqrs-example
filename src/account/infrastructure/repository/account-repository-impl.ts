import { Inject } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

import {
  EntityId,
  EntityIdTransformer,
  ENTITY_ID_TRANSFORMER,
  writeConnection,
} from 'libs/database/database-module';

import { AccountEntity } from 'src/account/infrastructure/entity/account-entity';
import { OutboxWriter } from 'src/outbox/outbox-writer';

import {
  AccountRepository,
  FindAccountsOptions,
  FindAccountsRepositoryResult,
} from 'src/account/domain/account-repository';
import { Account, AccountProperties } from 'src/account/domain/account';
import { AccountFactory } from 'src/account/domain/account-factory';

export class AccountRepositoryImplement extends AccountRepository {
  @Inject() private readonly accountFactory: AccountFactory;
  @Inject() private readonly outboxWriter: OutboxWriter;
  @Inject(ENTITY_ID_TRANSFORMER)
  private readonly entityIdTransformer: EntityIdTransformer;

  async newId(): Promise<string> {
    return new EntityId().toString();
  }

  async saveAccount(data: Account | Account[]): Promise<void> {
    const models = Array.isArray(data) ? data : [data];
    const entities = models.map((model) => this.modelToEntity(model));
    await writeConnection.manager.getRepository(AccountEntity).save(entities);

    const events = models.flatMap((model) => [...model.domainEvents]);
    if (events.length > 0) {
      await this.outboxWriter.saveAll(events);
      models.forEach((model) => model.clearEvents());
    }
  }

  async findAccounts(
    options: FindAccountsOptions,
  ): Promise<FindAccountsRepositoryResult> {
    const where: FindOptionsWhere<AccountEntity> = {};
    if (options.id) where.id = this.entityIdTransformer.to(options.id);

    const entities = await writeConnection.manager
      .getRepository(AccountEntity)
      .find({
        where,
        skip: options.page * options.take,
        take: options.take,
      });
    return { accounts: entities.map((entity) => this.entityToModel(entity)) };
  }

  private modelToEntity(model: Account): AccountEntity {
    const properties = JSON.parse(JSON.stringify(model)) as AccountProperties;
    return {
      ...properties,
      id: this.entityIdTransformer.to(properties.id),
      createdAt: properties.createdAt,
      deletedAt: properties.deletedAt,
    };
  }

  private entityToModel(entity: AccountEntity): Account {
    return this.accountFactory.reconstitute({
      ...entity,
      id: this.entityIdTransformer.from(entity.id),
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
    });
  }
}
