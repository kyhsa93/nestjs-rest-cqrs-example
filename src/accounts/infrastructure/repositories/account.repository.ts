import { getRepository, In } from 'typeorm';

import { AccountEntity } from 'src/accounts/infrastructure/entities/account.entity';

import { AccountRepository } from 'src/accounts/domain/repository';
import { Account } from 'src/accounts/domain/account';
import { AccountFactory } from 'src/accounts/domain/factory';

export class AccountRepositoryImplement implements AccountRepository {

  constructor(private readonly accountFactory: AccountFactory) {}

  async newId(): Promise<string> {
    const emptyEntity = new AccountEntity();
    const entity = await getRepository(AccountEntity).save(emptyEntity);
    return entity.id;
  }

  async save(data: Account | Account[]): Promise<void> {
    const models = Array.isArray(data) ? data : [data];
    const entities = models.map((model) => this.modelToEntity(model));
    await getRepository(AccountEntity).save(entities);
  }

  async findById(id: string): Promise<Account | null> {
    const entity = await getRepository(AccountEntity).findOne({ id });
    return entity ? this.entityToModel(entity) : null;
  }

  async findByIds(ids: string[]): Promise<Account[]> {
    const entities = await getRepository(AccountEntity).find({ id: In(ids) });
    return entities.map((entity) => this.entityToModel(entity));
  }

  async findByName(name: string): Promise<Account[]> {
    const entities = await getRepository(AccountEntity).find({ name });
    return entities.map((entity) => this.entityToModel(entity));
  }

  private modelToEntity(model: Account): AccountEntity {
    const properties = model.properties();
    return {
      ...properties,
      createdAt: properties.openedAt,
      deletedAt: properties.closedAt,
    };
  }

  private entityToModel(entity: AccountEntity): Account {
    return this.accountFactory.reconstitute({ ...entity,openedAt: entity.createdAt,
      closedAt: entity.deletedAt })
  }
}
