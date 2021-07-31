import { getRepository } from 'typeorm';

import { AccountEntity } from 'src/accounts/infrastructure/entities/account.entity';

import { AccountRepository } from 'src/accounts/domain/repository';
import { Account } from 'src/accounts/domain/account';

export class AccountRepositoryImplement implements AccountRepository {
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

  async findById(id: string): Promise<Account | undefined> {
    const entity = await getRepository(AccountEntity).findOne({ id });
    return entity ? this.entityToModel(entity) : undefined;
  }

  async findByName(name: string): Promise<Account[]> {
    const entities = await getRepository(AccountEntity).find({ name });
    return entities.map((entity) => this.entityToModel(entity));
  }

  private modelToEntity(model: Account): AccountEntity {
    const properties = model.properties();
    return { ...properties, createdAt: properties.openedAt, deletedAt: properties.closedAt };
  }

  private entityToModel(entity: AccountEntity): Account {
    return new Account({ ...entity, openedAt: entity.createdAt, closedAt: entity.deletedAt });
  }
}
