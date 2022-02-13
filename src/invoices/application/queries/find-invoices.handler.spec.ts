import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { InjectionToken } from 'src/invoices/application/injection.token';
import {
  InvoiceQuery,
  Invoices,
} from 'src/invoices/application/queries/invoice.query';
import { FindInvoicesHandler } from 'src/invoices/application/queries/find-invoices.handler';
import { FindInvoicesQuery } from 'src/invoices/application/queries/find-invoices.query';
import { FindInvoicesResult } from 'src/invoices/application/queries/find-invoices.result';

describe('FindInvoicesHandler', () => {
  let handler: FindInvoicesHandler;
  let invoiceQuery: InvoiceQuery;

  beforeEach(async () => {
    const queryProvider: Provider = {
      provide: InjectionToken.INVOICE_QUERY,
      useValue: {},
    };
    const providers: Provider[] = [queryProvider, FindInvoicesHandler];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();
    handler = testModule.get(FindInvoicesHandler);
    invoiceQuery = testModule.get(InjectionToken.INVOICE_QUERY);
  });

  describe('execute', () => {
    it('should return FindInvoicesResult when execute FindInvoicesQuery', async () => {
      const invoices: Invoices = [
        {
          id: 'invoiceId',
          name: 'test',
          password: 'password',
          status: 0,
          openedAt: expect.anything(),
          updatedAt: expect.anything(),
          closedAt: null,
        },
      ];
      invoiceQuery.find = jest.fn().mockResolvedValue(invoices);

      const query = new FindInvoicesQuery(0, 1);

      const result: FindInvoicesResult = [
        {
          id: 'invoiceId',
          name: 'test',
          status: 0,
        },
      ];

      await expect(handler.execute(query)).resolves.toEqual(result);
      expect(invoiceQuery.find).toBeCalledTimes(1);
      expect(invoiceQuery.find).toBeCalledWith(query.offset, query.limit);
    });
  });
});
