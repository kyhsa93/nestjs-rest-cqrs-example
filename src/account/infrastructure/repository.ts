import { getRepository } from 'typeorm';
import uuid from 'uuid';

import AccountEntity from '@src/account/infrastructure/entity/account';

import Account from '@src/account/domain/model/account';
import AccountRepository from '@src/account/domain/repository';
import AccountFactory from '@src/account/domain/factory';

export default class AccountRepositoryImplement implements AccountRepository {
  constructor(private readonly accountFactory: AccountFactory) {}

  public async newId (): Promise<string> {
    const emptyEntity = new AccountEntity();
    emptyEntity.name = uuid.v1();
    emptyEntity.balance = 0;
    emptyEntity.openedAt = new Date();
    emptyEntity.updatedAt = new Date();
    const entity = await getRepository(AccountEntity).save(emptyEntity);
    return entity.id;
  };

  public async save(data: Account | Account[]): Promise<void> {
    const models = Array.isArray(data) ? data : [data];
    const entities = models.map((model) => this.modelToEntity(model));
    await getRepository(AccountEntity).save(entities);
  }

  public async findById(id: string): Promise<Account | undefined> {
    const entity = await getRepository(AccountEntity).findOne({ id });
    return entity ? this.entityToModel(entity) : undefined;
  }

  public async findByName(name: string): Promise<Account[]> {
    const entities = await getRepository(AccountEntity).find({ name });
    return entities.map((entity) => this.entityToModel(entity));
  }

  private modelToEntity(model: Account): AccountEntity {
    const attributes = model.attributes();
    return { ...attributes, password: { ...attributes.password } };
  };

  private entityToModel(entity: AccountEntity): Account {
    return this.accountFactory.reconstitute({ ...entity });
  }
}
