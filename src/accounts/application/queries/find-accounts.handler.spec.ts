import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { InjectionToken } from 'src/accounts/application/injection.token';
import {
  AccountQuery,
  Accounts,
} from 'src/accounts/application/queries/account.query';
import { FindAccountsHandler } from 'src/accounts/application/queries/find-accounts.handler';
import { FindAccountsQuery } from 'src/accounts/application/queries/find-accounts.query';
import { FindAccountsResult } from 'src/accounts/application/queries/find-accounts.result';

describe('FindAccountsHandler', () => {
  let handler: FindAccountsHandler;
  let accountQuery: AccountQuery;

  beforeEach(async () => {
    const queryProvider: Provider = {
      provide: InjectionToken.ACCOUNT_QUERY,
      useValue: {},
    };
    const providers: Provider[] = [queryProvider, FindAccountsHandler];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();
    handler = testModule.get(FindAccountsHandler);
    accountQuery = testModule.get(InjectionToken.ACCOUNT_QUERY);
  });

  describe('execute', () => {
    it('should return FindAccountsResult when execute FindAccountsQuery', async () => {
      const accounts: Accounts = [
        {
          id: 'accountId',
          name: 'test',
          password: 'password',
          balance: 0,
          openedAt: new Date(),
          updatedAt: new Date(),
          closedAt: null,
        },
      ];
      accountQuery.find = jest.fn().mockResolvedValue(accounts);

      const query = new FindAccountsQuery(0, 1);

      const result: FindAccountsResult = [
        {
          id: 'accountId',
          name: 'test',
          balance: 0,
        },
      ];

      await expect(handler.execute(query)).resolves.toEqual(result);
      expect(accountQuery.find).toBeCalledTimes(1);
      expect(accountQuery.find).toBeCalledWith(query.offset, query.limit);
    });
  });
});
