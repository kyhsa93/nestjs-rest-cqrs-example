import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { WithdrawCommand } from 'src/invoices/application/commands/withdraw.command';
import { WithdrawHandler } from 'src/invoices/application/commands/withdraw.handler';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { InvoiceRepository } from 'src/invoices/domain/repository/repository';

describe('WithdrawHandler', () => {
  let handler: WithdrawHandler;
  let repository: InvoiceRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.INVOICE_REPOSITORY,
      useValue: {},
    };
    const providers: Provider[] = [WithdrawHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(WithdrawHandler);
    repository = testModule.get(InjectionToken.INVOICE_REPOSITORY);
  });

  describe('execute', () => {
    it('should throw NotFoundException when invoice not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new WithdrawCommand({
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

    it('should execute WithdrawCommand', async () => {
      const invoice = { withdraw: jest.fn(), commit: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue(invoice);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new WithdrawCommand({
        id: 'invoiceId',
        password: 'password',
        amount: 1,
      });

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(invoice.withdraw).toBeCalledTimes(1);
      expect(invoice.withdraw).toBeCalledWith(command.amount, command.password);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(invoice);
      expect(invoice.commit).toBeCalledTimes(1);
    });
  });
});
