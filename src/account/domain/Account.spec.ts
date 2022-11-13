import {
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';

import {
  AccountImplement,
  AccountProperties,
} from 'src/account/domain/Account';
import { AccountClosedEvent } from 'src/account/domain/event/AccountClosedEvent';
import { AccountOpenedEvent } from 'src/account/domain/event/AccountOpenedEvent';
import { DepositedEvent } from 'src/account/domain/event/DepositedEvent';
import { PasswordUpdatedEvent } from 'src/account/domain/event/PasswordUpdatedEvent';
import { WithdrawnEvent } from 'src/account/domain/event/WithdrawnEvent';

describe('Account', () => {
  describe('open', () => {
    it('should apply AccountOpenedEvent', () => {
      const account = new AccountImplement({
        id: 'id',
        email: 'email',
      } as AccountProperties);

      account.open();

      const appliedEvent = account.getUncommittedEvents();

      expect(appliedEvent).toEqual([new AccountOpenedEvent('id', 'email')]);
    });
  });

  describe('updatePassword', () => {
    it('should update password', () => {
      const account = new AccountImplement({
        id: 'id',
        email: 'email',
      } as AccountProperties);

      account.updatePassword('password');

      expect(account.getUncommittedEvents().length).toEqual(1);
      expect(account.getUncommittedEvents()).toEqual([
        new PasswordUpdatedEvent('id', 'email'),
      ]);
      expect(account.updatePassword('password')).toEqual(undefined);
    });
  });

  describe('withdraw', () => {
    it('should throw InternalServerErrorException when given amount is under 1', () => {
      const account = new AccountImplement({} as AccountProperties);

      expect(() => account.withdraw(0)).toThrowError(
        InternalServerErrorException,
      );
    });

    it('should throw UnprocessableEntityException when given amount is over account balance', () => {
      const account = new AccountImplement({
        id: 'id',
        name: 'name',
        balance: 0,
      } as AccountProperties);

      expect(() => account.withdraw(1)).toThrowError(
        UnprocessableEntityException,
      );
    });

    it('should withdraw from account', () => {
      const account = new AccountImplement({
        id: 'id',
        name: 'name',
        balance: 1,
        email: 'email',
      } as AccountProperties);

      expect(account.withdraw(1)).toEqual(undefined);

      expect(account.getUncommittedEvents()).toEqual([
        new WithdrawnEvent('id', 'email'),
      ]);
    });
  });

  describe('deposit', () => {
    it('should throw InternalServerErrorException when given amount is under 1', () => {
      const account = new AccountImplement({} as AccountProperties);

      expect(() => account.deposit(0)).toThrowError(
        InternalServerErrorException,
      );
    });

    it('should deposit to account', () => {
      const account = new AccountImplement({
        id: 'id',
        name: 'name',
        balance: 0,
        email: 'email',
      } as AccountProperties);

      account.deposit(1);

      expect(account.getUncommittedEvents()).toEqual([
        new DepositedEvent('id', 'email'),
      ]);
      expect(
        (JSON.parse(JSON.stringify(account)) as AccountProperties).balance,
      ).toEqual(1);
    });
  });

  describe('close', () => {
    it('should throw UnprocessableEntityException when account balance is over 0', () => {
      const account = new AccountImplement({
        id: 'id',
        name: 'name',
        balance: 1,
      } as AccountProperties);

      expect(() => account.close()).toThrowError(UnprocessableEntityException);
    });

    it('should close account', () => {
      const account = new AccountImplement({
        id: 'id',
        name: 'name',
        email: 'email',
      } as AccountProperties);

      account.close();

      expect(account.getUncommittedEvents()).toEqual([
        new AccountClosedEvent('id', 'email'),
      ]);
    });
  });
});
