import {
  AccountImplement,
  AccountProperties,
} from 'src/account/domain/Account';
import { ErrorMessage } from 'src/account/domain/ErrorMessage';
import { AccountClosedEvent } from 'src/account/domain/event/AccountClosedEvent';
import { AccountOpenedEvent } from 'src/account/domain/event/AccountOpenedEvent';
import { DepositedEvent } from 'src/account/domain/event/DepositedEvent';
import { PasswordUpdatedEvent } from 'src/account/domain/event/PasswordUpdatedEvent';
import { WithdrawnEvent } from 'src/account/domain/event/WithdrawnEvent';

describe('Account', () => {
  describe('open', () => {
    it('should record AccountOpenedEvent in domainEvents', () => {
      const account = new AccountImplement({
        id: 'id',
        email: 'email',
      } as AccountProperties);

      account.open();

      expect(account.domainEvents).toEqual([
        new AccountOpenedEvent('id', 'email'),
      ]);

      account.clearEvents();
      expect(account.domainEvents).toEqual([]);
    });
  });

  describe('updatePassword', () => {
    it('should update password', () => {
      const account = new AccountImplement({
        id: 'id',
        email: 'email',
      } as AccountProperties);

      account.updatePassword('password');

      expect(account.domainEvents).toEqual([
        new PasswordUpdatedEvent('id', 'email'),
      ]);
      expect(account.updatePassword('password')).toEqual(undefined);
    });
  });

  describe('withdraw', () => {
    it('should throw error when given amount is under 1', () => {
      const account = new AccountImplement({} as AccountProperties);

      expect(() => account.withdraw(0)).toThrow(
        ErrorMessage.CAN_NOT_WITHDRAW_UNDER_1,
      );
    });

    it('should throw error when given amount is over account balance', () => {
      const account = new AccountImplement({
        id: 'id',
        name: 'name',
        balance: 0,
      } as AccountProperties);

      expect(() => account.withdraw(1)).toThrow(
        ErrorMessage.REQUESTED_AMOUNT_EXCEEDS_YOUR_WITHDRAWAL_LIMIT,
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

      expect(account.domainEvents).toEqual([new WithdrawnEvent('id', 'email')]);
    });
  });

  describe('deposit', () => {
    it('should throw error when given amount is under 1', () => {
      const account = new AccountImplement({} as AccountProperties);

      expect(() => account.deposit(0)).toThrow(
        ErrorMessage.CAN_NOT_DEPOSIT_UNDER_1,
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

      expect(account.domainEvents).toEqual([new DepositedEvent('id', 'email')]);
      expect(
        (JSON.parse(JSON.stringify(account)) as AccountProperties).balance,
      ).toEqual(1);
    });
  });

  describe('close', () => {
    it('should throw error when account balance is over 0', () => {
      const account = new AccountImplement({
        id: 'id',
        name: 'name',
        balance: 1,
      } as AccountProperties);

      expect(() => account.close()).toThrow(
        ErrorMessage.ACCOUNT_BALANCE_IS_REMAINED,
      );
    });

    it('should close account', () => {
      const account = new AccountImplement({
        id: 'id',
        name: 'name',
        email: 'email',
      } as AccountProperties);

      account.close();

      expect(account.domainEvents).toEqual([
        new AccountClosedEvent('id', 'email'),
      ]);
    });
  });
});
