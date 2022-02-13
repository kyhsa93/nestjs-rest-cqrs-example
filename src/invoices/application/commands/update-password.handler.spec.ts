import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { UpdatePasswordCommand } from 'src/invoices/application/commands/update-password.command';
import { UpdatePasswordHandler } from 'src/invoices/application/commands/update-password.handler';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { InvoiceRepository } from 'src/invoices/domain/repository/repository';

describe('UpdatePasswordHandler', () => {
  let handler: UpdatePasswordHandler;
  let repository: InvoiceRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.INVOICE_REPOSITORY,
      useValue: {},
    };
    const providers: Provider[] = [UpdatePasswordHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(UpdatePasswordHandler);
    repository = testModule.get(InjectionToken.INVOICE_REPOSITORY);
  });

  describe('execute', () => {
    it('should throw NotFoundException when invoice not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new UpdatePasswordCommand({
        id: 'invoiceId',
        password: 'password',
        newPassword: 'newPassword',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
    });

    it('should execute UpdatePasswordCommand', async () => {
      const invoice = { updatePassword: jest.fn(), commit: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue(invoice);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new UpdatePasswordCommand({
        id: 'invoiceId',
        password: 'password',
        newPassword: 'newPassword',
      });

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(invoice.updatePassword).toBeCalledTimes(1);
      expect(invoice.updatePassword).toBeCalledWith(
        command.password,
        command.newPassword,
      );
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(invoice);
      expect(invoice.commit).toBeCalledTimes(1);
    });
  });
});
