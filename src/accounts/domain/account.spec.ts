import {
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Account, AccountProperties } from 'src/accounts/domain/account';
import { AccountClosedEvent } from 'src/accounts/domain/events/account-closed.event';
import { AccountOpenedEvent } from 'src/accounts/domain/events/account-opened.event';
import { DepositedEvent } from 'src/accounts/domain/events/deposited.event';
import { PasswordUpdatedEvent } from 'src/accounts/domain/events/password-updated.event';
import { WithdrawnEvent } from 'src/accounts/domain/events/withdrawn.event';

describe('Account', () => {
  describe('properties', () => {
    it('should return AccountProperties', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'tester',
        password: 'password',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);

      const result = account.properties();

      expect(result).toEqual(properties);
    });
  });

  describe('open', () => {
    it('should apply AccountOpenedEvent', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'tester',
        password: 'password',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);

      account.open();

      const result = account.getUncommittedEvents();

      expect(result).toEqual([
        Object.assign(new AccountOpenedEvent(), account),
      ]);
    });
  });

  describe('setPassword', () => {
    it('should throw InternalServerErrorException when password that account already have is not empty string', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'tester',
        password: 'password',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);

      expect(() => account.setPassword('password')).toThrowError(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException when given password is empty string', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'tester',
        password: '',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);

      expect(() => account.setPassword('')).toThrowError(
        InternalServerErrorException,
      );
    });

    it('should set password', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'tester',
        password: '',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);

      account.setPassword('password');

      expect(account.properties().password).not.toEqual('');
      expect(account.properties().password).not.toEqual('password');
    });
  });

  describe('updatePassword', () => {
    it('should throw UnauthorizedException when password is not matched', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'test',
        password: '',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);
      account.setPassword('password');

      expect(() =>
        account.updatePassword('wrongPassword', 'newPassword'),
      ).toThrowError(UnauthorizedException);
    });

    it('should update password', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'test',
        password: '',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);
      account.setPassword('password');

      account.updatePassword('password', 'newPassword');

      account.getUncommittedEvents();

      expect(account.properties().password).not.toEqual('');
      expect(account.properties().password).not.toEqual('password');
      expect(() => account.setPassword('data')).toThrowError(
        InternalServerErrorException,
      );
      expect(account.getUncommittedEvents().length).toEqual(1);
      expect(account.getUncommittedEvents()).toEqual([
        Object.assign(new PasswordUpdatedEvent(), account),
      ]);
      expect(account.updatePassword('newPassword', 'data')).toEqual(undefined);
    });
  });

  describe('withdraw', () => {
    it('should throw UnauthorizedException when password is not matched', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'test',
        password: '',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);
      account.setPassword('password');

      expect(() => account.withdraw(0, 'wrongPassword')).toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw InternalServerErrorException when given amount is under 1', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'test',
        password: '',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);
      account.setPassword('password');

      expect(() => account.withdraw(0, 'password')).toThrowError(
        InternalServerErrorException,
      );
    });

    it('should throw UnprocessableEntityException when given amount is over account balance', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'test',
        password: '',
        balance: 1,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);
      account.setPassword('password');

      expect(() => account.withdraw(2, 'password')).toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should withdraw from account', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'test',
        password: '',
        balance: 1,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);
      account.setPassword('password');

      account.withdraw(1, 'password');

      expect(account.getUncommittedEvents()).toEqual([
        Object.assign(new WithdrawnEvent(), account),
      ]);
      expect(() => account.withdraw(1, 'password')).toThrowError(
        UnprocessableEntityException,
      );
    });
  });

  describe('deposit', () => {
    it('should throw InternalServerErrorException when given amount is under 1', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'test',
        password: '',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);
      account.setPassword('password');

      expect(() => account.deposit(0)).toThrowError(
        InternalServerErrorException,
      );
    });

    it('should deposit to account', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'test',
        password: '',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);
      account.setPassword('password');

      account.deposit(1);

      expect(account.getUncommittedEvents()).toEqual([
        Object.assign(new DepositedEvent(), account),
      ]);
      expect(account.withdraw(1, 'password')).toEqual(undefined);
    });
  });

  describe('close', () => {
    it('should throw UnauthorizedException when password is not matched', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'test',
        password: '',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);
      account.setPassword('password');

      expect(() => account.close('wrongPassword')).toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw UnprocessableEntityException when account balance is over 0', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'test',
        password: '',
        balance: 1,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);
      account.setPassword('password');

      expect(() => account.close('password')).toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should close account', () => {
      const properties: AccountProperties = {
        id: 'accountId',
        name: 'test',
        password: '',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(properties);
      account.setPassword('password');

      account.close('password');

      expect(account.getUncommittedEvents()).toEqual([
        Object.assign(new AccountClosedEvent(), account),
      ]);
    });
  });
});
