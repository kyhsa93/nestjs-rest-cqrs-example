import {
  ModuleMetadata,
  NotFoundException,
  Provider,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { RemitCommand } from 'src/invoices/application/commands/remit.command';
import { RemitHandler } from 'src/invoices/application/commands/remit.handler';
import { InjectionToken } from 'src/invoices/application/injection.token';

import { InvoiceRepository } from 'src/invoices/domain/repository/repository';
import { InvoiceService } from 'src/invoices/domain/service/service';

describe('RemitHandler', () => {
  let handler: RemitHandler;
  let repository: InvoiceRepository;
  let domainService: InvoiceService;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.INVOICE_REPOSITORY,
      useValue: {},
    };
    const domainServiceProvider: Provider = {
      provide: InvoiceService,
      useValue: {},
    };
    const providers: Provider[] = [
      RemitHandler,
      repoProvider,
      domainServiceProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(RemitHandler);
    repository = testModule.get(InjectionToken.INVOICE_REPOSITORY);
    domainService = testModule.get(InvoiceService);
  });

  describe('execute', () => {
    it('should throw UnprocessableEntityException when id and receiverId is same', async () => {
      const command = new RemitCommand({
        id: 'invoiceId',
        receiverId: 'invoiceId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should throw NotFoundException when repository found no invoice', async () => {
      repository.findByIds = jest.fn().mockResolvedValue([]);

      const command = new RemitCommand({
        id: 'invoiceId',
        receiverId: 'receiverId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
    });

    it('should throw NotFoundException when repository found just single invoice', async () => {
      repository.findByIds = jest.fn().mockResolvedValue([{}]);

      const command = new RemitCommand({
        id: 'invoiceId',
        receiverId: 'receiverId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
    });

    it('should throw NotFoundException when invoice not found', async () => {
      const invoice = { compareId: (id: string) => id === 'wrongId' };
      const receiver = { compareId: (id: string) => id === 'receiverId' };

      repository.findByIds = jest.fn().mockResolvedValue([invoice, receiver]);

      const command = new RemitCommand({
        id: 'invoiceId',
        receiverId: 'receiverId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
    });

    it('should throw UnprocessableEntityException receiver is not found', async () => {
      const invoice = { compareId: (id: string) => id === 'invoiceId' };
      const receiver = { compareId: (id: string) => id === 'wrongId' };

      repository.findByIds = jest.fn().mockResolvedValue([invoice, receiver]);
      domainService.remit = jest.fn();
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new RemitCommand({
        id: 'invoiceId',
        receiverId: 'receiverId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).rejects.toThrowError(
        UnprocessableEntityException,
      );
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
    });

    it('should execute RemitCommand', async () => {
      const invoice = {
        commit: jest.fn(),
        compareId: (id: string) => id === 'invoiceId',
      };
      const receiver = {
        commit: jest.fn(),
        compareId: (id: string) => id === 'receiverId',
      };

      repository.findByIds = jest.fn().mockResolvedValue([invoice, receiver]);
      repository.save = jest.fn().mockResolvedValue(undefined);
      domainService.remit = jest.fn().mockReturnValue(undefined);

      const command = new RemitCommand({
        id: 'invoiceId',
        receiverId: 'receiverId',
        amount: 1,
        password: 'password',
      });

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findByIds).toBeCalledTimes(1);
      expect(repository.findByIds).toBeCalledWith([
        command.id,
        command.receiverId,
      ]);
      expect(domainService.remit).toBeCalledTimes(1);
      expect(domainService.remit).toBeCalledWith({
        invoice,
        receiver,
        password: command.password,
        amount: command.amount,
      });
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith([invoice, receiver]);
      expect(invoice.commit).toBeCalledTimes(1);
      expect(receiver.commit).toBeCalledTimes(1);
    });
  });
});
