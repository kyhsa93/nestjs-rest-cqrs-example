import {
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { InvoiceImplement } from 'src/invoices/domain/entity/invoice';
import { InvoiceClosedEvent } from 'src/invoices/domain/events/invoice-closed.event';
import { InvoiceOpenedEvent } from 'src/invoices/domain/events/invoice-opened.event';
import { DepositedEvent } from 'src/invoices/domain/events/deposited.event';
import { PasswordUpdatedEvent } from 'src/invoices/domain/events/password-updated.event';
import { WithdrawnEvent } from 'src/invoices/domain/events/withdrawn.event';

describe('Invoice', () => {
  describe('properties', () => {
    it('should return InvoiceProperties', () => {
      const properties = {
        id: 'id',
        name: 'name',
        password: '',
        status: 0,
        openedAt: expect.anything(),
        updatedAt: expect.anything(),
        closedAt: null,
        version: 0,
      };

      const invoice = new InvoiceImplement({ id: 'id', name: 'name' });

      const result = invoice.properties();

      expect(result).toEqual(properties);
    });
  });

  describe('open', () => {
    it('should apply InvoiceOpenedEvent', () => {
      const invoice = new InvoiceImplement({ id: 'id', name: 'name' });

      invoice.open('password');

      const result = invoice.getUncommittedEvents();

      expect(result).toEqual([
        Object.assign(new InvoiceOpenedEvent(), invoice),
      ]);
    });
  });

  describe('updatePassword', () => {
    it('should throw UnauthorizedException when password is not matched', () => {
      const invoice = new InvoiceImplement({ id: 'id', name: 'name' });
      invoice.open('password');
      invoice.uncommit();

      expect(() =>
        invoice.updatePassword('wrongPassword', 'newPassword'),
      ).toThrowError(UnauthorizedException);
    });

    it('should update password', () => {
      const invoice = new InvoiceImplement({ id: 'id', name: 'name' });
      invoice.open('password');
      invoice.uncommit();

      invoice.updatePassword('password', 'newPassword');

      invoice.getUncommittedEvents();

      expect(invoice.properties().password).not.toEqual('');
      expect(invoice.properties().password).not.toEqual('password');
      expect(() => invoice.open('data')).toThrowError(
        InternalServerErrorException,
      );
      expect(invoice.getUncommittedEvents().length).toEqual(1);
      expect(invoice.getUncommittedEvents()).toEqual([
        Object.assign(new PasswordUpdatedEvent(), invoice),
      ]);
      expect(invoice.updatePassword('newPassword', 'data')).toEqual(undefined);
    });
  });

  describe('withdraw', () => {
    it('should throw UnauthorizedException when password is not matched', () => {
      const invoice = new InvoiceImplement({ id: 'id', name: 'name' });
      invoice.open('password');
      invoice.uncommit();

      expect(() => invoice.withdraw(0, 'wrongPassword')).toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw InternalServerErrorException when given amount is under 1', () => {
      const invoice = new InvoiceImplement({ id: 'id', name: 'name' });
      invoice.open('password');
      invoice.uncommit();

      expect(() => invoice.withdraw(0, 'password')).toThrowError(
        InternalServerErrorException,
      );
    });

    it('should throw UnprocessableEntityException when given amount is over invoice status', () => {
      const invoice = new InvoiceImplement({
        id: 'id',
        name: 'name',
        status: 0,
      });
      invoice.open('password');
      invoice.uncommit();

      expect(() => invoice.withdraw(1, 'password')).toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should withdraw from invoice', () => {
      const invoice = new InvoiceImplement({
        id: 'id',
        name: 'name',
        status: 1,
      });
      invoice.open('password');
      invoice.uncommit();

      expect(invoice.withdraw(1, 'password')).toEqual(undefined);

      expect(invoice.getUncommittedEvents()).toEqual([
        Object.assign(new WithdrawnEvent(), invoice),
      ]);
    });
  });

  describe('deposit', () => {
    it('should throw InternalServerErrorException when given amount is under 1', () => {
      const invoice = new InvoiceImplement({ id: 'id', name: 'name' });
      invoice.open('password');
      invoice.uncommit();

      expect(() => invoice.deposit(0)).toThrowError(
        InternalServerErrorException,
      );
    });

    it('should deposit to invoice', () => {
      const invoice = new InvoiceImplement({ id: 'id', name: 'name' });
      invoice.open('password');
      invoice.uncommit();

      invoice.deposit(1);

      expect(invoice.getUncommittedEvents()).toEqual([
        Object.assign(new DepositedEvent(), invoice),
      ]);
      expect(invoice.withdraw(1, 'password')).toEqual(undefined);
    });
  });

  describe('close', () => {
    it('should throw UnauthorizedException when password is not matched', () => {
      const invoice = new InvoiceImplement({ id: 'id', name: 'name' });
      invoice.open('password');
      invoice.uncommit();

      expect(() => invoice.close('wrongPassword')).toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw UnprocessableEntityException when invoice status is over 0', () => {
      const invoice = new InvoiceImplement({
        id: 'id',
        name: 'name',
        status: 1,
      });
      invoice.open('password');
      invoice.uncommit();

      expect(() => invoice.close('password')).toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should close invoice', () => {
      const invoice = new InvoiceImplement({ id: 'id', name: 'name' });

      invoice.open('password');
      invoice.uncommit();

      invoice.close('password');
      expect(invoice.getUncommittedEvents()).toEqual([
        Object.assign(new InvoiceClosedEvent(), invoice),
      ]);
    });
  });
});
