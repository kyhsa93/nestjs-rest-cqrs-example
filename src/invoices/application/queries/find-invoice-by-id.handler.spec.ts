import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectionToken } from 'src/invoices/application/injection.token';

import {
  Invoice,
  InvoiceQuery,
} from 'src/invoices/application/queries/invoice.query';
import { FindInvoiceByIdHandler } from 'src/invoices/application/queries/find-invoice-by-id.handler';
import { FindInvoiceByIdQuery } from 'src/invoices/application/queries/find-invoice-by-id.query';
import { FindInvoiceByIdResult } from 'src/invoices/application/queries/find-invoice-by-id.result';

describe('FindInvoiceByIdHandler', () => {
  let invoiceQuery: InvoiceQuery;
  let handler: FindInvoiceByIdHandler;

  beforeEach(async () => {
    const queryProvider: Provider = {
      provide: InjectionToken.INVOICE_QUERY,
      useValue: {},
    };
    const providers: Provider[] = [queryProvider, FindInvoiceByIdHandler];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();
    invoiceQuery = testModule.get(InjectionToken.INVOICE_QUERY);
    handler = testModule.get(FindInvoiceByIdHandler);
  });

  describe('execute', () => {
    it('should throw NotFoundException when data is not found', async () => {
      invoiceQuery.findById = jest.fn().mockResolvedValue(undefined);

      const query = new FindInvoiceByIdQuery('invoiceId');

      await expect(handler.execute(query)).rejects.toThrowError(
        NotFoundException,
      );
      expect(invoiceQuery.findById).toBeCalledTimes(1);
      expect(invoiceQuery.findById).toBeCalledWith(query.id);
    });

    it('should return FindInvoiceByIdResult when execute FindInvoiceByIdQuery', async () => {
      const invoice: Invoice = {
        id: 'invoiceId',
        name: 'test',
        password: 'password',
        status: 0,
        openedAt: expect.anything(),
        updatedAt: expect.anything(),
        closedAt: null,
      };
      invoiceQuery.findById = jest.fn().mockResolvedValue(invoice);

      const query = new FindInvoiceByIdQuery('invoiceId');

      const result: FindInvoiceByIdResult = {
        id: 'invoiceId',
        name: 'test',
        status: 0,
        openedAt: expect.anything(),
        updatedAt: expect.anything(),
        closedAt: null,
      };

      await expect(handler.execute(query)).resolves.toEqual(result);
      expect(invoiceQuery.findById).toBeCalledTimes(1);
      expect(invoiceQuery.findById).toBeCalledWith(query.id);
    });
  });
});
