import { Inject } from '@nestjs/common';

import {
  EntityId,
  EntityIdTransformer,
  ENTITY_ID_TRANSFORMER,
  writeConnection,
} from 'libs/database-module';

import { AccountEntity } from 'src/account/infrastructure/entity/account-entity';
import { OutboxWriter } from 'src/outbox/outbox-writer';

import { AccountRepository } from 'src/account/domain/account-repository';
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

  async save(data: Account | Account[]): Promise<void> {
    const models = Array.isArray(data) ? data : [data];
    const entities = models.map((model) => this.modelToEntity(model));
    await writeConnection.manager.getRepository(AccountEntity).save(entities);

    const events = models.flatMap((model) => [...model.domainEvents]);
    if (events.length > 0) {
      await this.outboxWriter.saveAll(events);
      models.forEach((model) => model.clearEvents());
    }
  }

  async findById(id: string): Promise<Account | null> {
    const entity = await writeConnection.manager
      .getRepository(AccountEntity)
      .findOneBy({ id: this.entityIdTransformer.to(id) });
    return entity ? this.entityToModel(entity) : null;
  }

  async findByName(name: string): Promise<Account[]> {
    const entities = await writeConnection.manager
      .getRepository(AccountEntity)
      .findBy({ name });
    return entities.map((entity) => this.entityToModel(entity));
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
