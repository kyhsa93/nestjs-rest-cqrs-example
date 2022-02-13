import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CloseInvoiceCommand } from 'src/invoices/application/commands/close-invoice.command';
import { CloseInvoiceHandler } from 'src/invoices/application/commands/close-invoice.handler';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { InvoiceRepository } from 'src/invoices/domain/repository/repository';

describe('CloseInvoiceHandler', () => {
  let handler: CloseInvoiceHandler;
  let repository: InvoiceRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.INVOICE_REPOSITORY,
      useValue: {},
    };
    const providers: Provider[] = [CloseInvoiceHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(CloseInvoiceHandler);
    repository = testModule.get(InjectionToken.INVOICE_REPOSITORY);
  });

  describe('execute', () => {
    it('should throw NotFoundException when invoice not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new CloseInvoiceCommand('invoiceId', 'password');

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
    });

    it('should execute CloseInvoiceCommand', async () => {
      const invoice = { close: jest.fn(), commit: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue(invoice);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new CloseInvoiceCommand('invoiceId', 'password');

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(invoice.close).toBeCalledTimes(1);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(invoice);
      expect(invoice.commit).toBeCalledTimes(1);
    });
  });
});
