import { Inject, Injectable } from '@nestjs/common';

import {
  EntityIdTransformer,
  ENTITY_ID_TRANSFORMER,
  readConnection,
} from 'libs/database/database-module';

import { AccountEntity } from 'src/account/infrastructure/entity/account-entity';

import { AccountQuery } from 'src/account/application/query/account-query';
import { FindAccountByIdResult } from 'src/account/application/query/find-account-by-id-result';
import { FindAccountsResult } from 'src/account/application/query/find-accounts-result';
import { FindAccountsQuery } from 'src/account/application/query/find-accounts-query';

@Injectable()
export class AccountQueryImplement extends AccountQuery {
  @Inject(ENTITY_ID_TRANSFORMER)
  private readonly entityIdTransformer: EntityIdTransformer;

  async findById(id: string): Promise<FindAccountByIdResult | null> {
    return readConnection
      .getRepository(AccountEntity)
      .findOneBy({ id: this.entityIdTransformer.to(id) })
      .then((entity) =>
        entity
          ? {
              id: this.entityIdTransformer.from(entity.id),
              name: entity.name,
              balance: entity.balance,
              createdAt: entity.createdAt,
              updatedAt: entity.updatedAt,
              deletedAt: entity.deletedAt,
            }
          : null,
      );
  }

  async find(query: FindAccountsQuery): Promise<FindAccountsResult> {
    return readConnection
      .getRepository(AccountEntity)
      .find({
        skip: query.page * query.take,
        take: query.take,
      })
      .then((entities) => ({
        accounts: entities.map((entity) => ({
          id: this.entityIdTransformer.from(entity.id),
          name: entity.name,
          balance: entity.balance,
        })),
      }));
  }
}
