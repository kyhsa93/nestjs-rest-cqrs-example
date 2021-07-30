import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import {
  Account,
  AccountQuery,
} from 'src/accounts/application/queries/account.query';
import { FindAccountByIdHandler } from 'src/accounts/application/queries/find-account-by-id.handler';
import { FindAccountByIdQuery } from 'src/accounts/application/queries/find-account-by-id.query';
import { FindAccountByIdResult } from 'src/accounts/application/queries/find-account-by-id.result';

describe('FindAccountByIdHandler', () => {
  let accountQuery: AccountQuery;
  let handler: FindAccountByIdHandler;

  beforeEach(async () => {
    const queryProvider: Provider = {
      provide: 'AccountQueryImplement',
      useValue: {},
    };
    const providers: Provider[] = [queryProvider, FindAccountByIdHandler];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();
    accountQuery = testModule.get('AccountQueryImplement');
    handler = testModule.get(FindAccountByIdHandler);
  });

  describe('execute', () => {
    it('should throw NotFoundException when data is not found', async () => {
      accountQuery.findById = jest.fn().mockResolvedValue(undefined);

      const query = new FindAccountByIdQuery('accountId');

      await expect(handler.execute(query)).rejects.toThrowError(
        NotFoundException,
      );
      expect(accountQuery.findById).toBeCalledTimes(1);
      expect(accountQuery.findById).toBeCalledWith(query.id);
    });

    it('should return FindAccountByIdResult when execute FindAccountByIdQuery', async () => {
      const account: Account = {
        id: 'accountId',
        name: 'test',
        password: 'password',
        balance: 0,
        openedAt: expect.anything(),
        updatedAt: expect.anything(),
        closedAt: null,
      };
      accountQuery.findById = jest.fn().mockResolvedValue(account);

      const query = new FindAccountByIdQuery('accountId');

      const result: FindAccountByIdResult = {
        id: 'accountId',
        name: 'test',
        balance: 0,
        openedAt: expect.anything(),
        updatedAt: expect.anything(),
        closedAt: null,
      };

      await expect(handler.execute(query)).resolves.toEqual(result);
      expect(accountQuery.findById).toBeCalledTimes(1);
      expect(accountQuery.findById).toBeCalledWith(query.id);
    });
  });
});
