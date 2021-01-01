import bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

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
        email: 'email',
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      expect(() => account.updatePassword('password', 'new password')).toThrow(
        UnauthorizedException,
      );
    });

    it('should return void', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        email: 'email',
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      expect(account.updatePassword('password', 'new password')).toEqual(undefined);
    });
  });

  describe('comparedPassword', () => {
    it('should return true when password is matched', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        email: 'email',
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      expect(account.comparePassword('password')).toEqual(true);
    });

    it('should return false when password is not matched', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        email: 'email',
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      expect(account.comparePassword('password')).toEqual(false);
    });
  });

  describe('delete', () => {
    it('should update account.deletedAt', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });
      const account = new Account({
        id: 'id',
        email: 'email',
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
      });

      account.delete();

      expect(account.deleted()).toEqual(true);
    });
  });
});
