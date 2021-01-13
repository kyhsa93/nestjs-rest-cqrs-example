import bcrypt from 'bcrypt';
import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';

import Password from '@src/account/domain/model/password';
import Account from '@src/account/domain/model/account';

describe('Account', () => {
  describe('updatePassword', () => {
    it('should throw UnauthorizedException when password is not matched', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        name: 'name',
        password,
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      expect(() => account.updatePassword('password', 'new password')).toThrow(
        UnauthorizedException,
      );
    });

    it('should return void when success', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        name: 'name',
        password,
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      expect(account.updatePassword('password', 'new password')).toEqual(undefined);
    });
  });

  describe('withdraw', () => {
    it('should throw UnauthorizedException when password is not matched', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        name: 'name',
        password,
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      expect(() => account.withdraw(0, 'password')).toThrow(UnauthorizedException);
    });

    it('should throw UnprocessableEntityException when amount is under 0', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        name: 'name',
        password,
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      expect(() => account.withdraw(-1, 'password')).toThrow(UnprocessableEntityException)
    });

    it('should throw UnprocessableEntityException when amount is under balance', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        name: 'name',
        password,
        balance: 10,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      expect(() => account.withdraw(100, 'password')).toThrow(UnprocessableEntityException)
    });

    it('should return void when success', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        name: 'name',
        password,
        balance: 10,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      expect(account.withdraw(1, 'password')).toEqual(undefined);
    });
  });

  describe('deposit', () => {
    it('should throw UnauthorizedException when password is not matched', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        name: 'name',
        password,
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      expect(() => account.deposit(0, 'password')).toThrow(UnauthorizedException);
    });

    it('should throw UnprocessableEntityException when amount is under 0', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        name: 'name',
        password,
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      expect(() => account.deposit(-1, 'password')).toThrow(UnprocessableEntityException)
    });

    it('should return void when success', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        name: 'name',
        password,
        balance: 10,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      expect(account.deposit(1, 'password')).toEqual(undefined);
    });
  });

  describe('close', () => {
    it('should throw UnauthorizedException when password is not matched', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        name: 'name',
        password,
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      expect(() => account.updatePassword('password', 'new password')).toThrow(
        UnauthorizedException,
      );
    });

    it('should return void when success', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        name: 'name',
        password,
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      expect(account.close('password')).toEqual(undefined);
      expect(account.toAnemic().closedAt).not.toEqual(undefined);
    });
  });
});
