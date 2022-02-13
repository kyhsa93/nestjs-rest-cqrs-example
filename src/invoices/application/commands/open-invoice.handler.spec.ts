import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { OpenInvoiceCommand } from 'src/invoices/application/commands/open-invoice.command';
import { OpenInvoiceHandler } from 'src/invoices/application/commands/open-invoice.handler';
import { InjectionToken } from 'src/invoices/application/injection.token';
import { InvoiceFactory } from 'src/invoices/domain/factory';

import { InvoiceRepository } from 'src/invoices/domain/repository/repository';

describe('OpenInvoiceHandler', () => {
  let handler: OpenInvoiceHandler;
  let repository: InvoiceRepository;
  let factory: InvoiceFactory;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.INVOICE_REPOSITORY,
      useValue: {},
    };
    const factoryProvider: Provider = {
      provide: InvoiceFactory,
      useValue: {},
    };
    const providers: Provider[] = [
      OpenInvoiceHandler,
      repoProvider,
      factoryProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(OpenInvoiceHandler);
    repository = testModule.get(InjectionToken.INVOICE_REPOSITORY);
    factory = testModule.get(InvoiceFactory);
  });

  describe('execute', () => {
    it('should execute OpenInvoiceCommand', async () => {
      const invoice = { open: jest.fn(), commit: jest.fn() };

      factory.create = jest.fn().mockReturnValue(invoice);
      repository.newId = jest.fn().mockResolvedValue('invoiceId');
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new OpenInvoiceCommand('invoiceId', 'password');

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.newId).toBeCalledTimes(1);
      expect(invoice.open).toBeCalledTimes(1);
      expect(invoice.open).toBeCalledWith(command.password);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(invoice);
      expect(invoice.commit).toBeCalledTimes(1);
    });
  });
});
