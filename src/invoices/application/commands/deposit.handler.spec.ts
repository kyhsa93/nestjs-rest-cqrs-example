import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { DepositCommand } from 'src/invoices/application/commands/deposit.command';
import { DepositHandler } from 'src/invoices/application/commands/deposit.handler';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { InvoiceRepository } from 'src/invoices/domain/repository/repository';

describe('DepositHandler', () => {
  let handler: DepositHandler;
  let repository: InvoiceRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.INVOICE_REPOSITORY,
      useValue: {},
    };
    const providers: Provider[] = [DepositHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(DepositHandler);
    repository = testModule.get(InjectionToken.INVOICE_REPOSITORY);
  });

  describe('execute', () => {
    it('should throw NotFoundException when invoice not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new DepositCommand({
        id: 'invoiceId',
        password: 'password',
        amount: 1,
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
    });

    it('should execute DepositCommand', async () => {
      const invoice = {
        deposit: jest.fn().mockReturnValue(undefined),
        commit: jest.fn().mockReturnValue(undefined),
      };

      repository.findById = jest.fn().mockResolvedValue(invoice);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new DepositCommand({
        id: 'invoiceId',
        password: 'password',
        amount: 1,
      });

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(invoice.deposit).toBeCalledTimes(1);
      expect(invoice.deposit).toBeCalledWith(command.amount);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(invoice);
      expect(invoice.commit).toBeCalledTimes(1);
    });
  });
});
