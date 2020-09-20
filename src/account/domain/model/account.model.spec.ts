import bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

import Password from '@src/account/domain/model/password.model';
import Account from './account.model';

describe('AccountModel', () => {
  describe('updatePassword', () => {
    it('should throw UnauthorizedException when password is not matched', async () => {
      const password = new Password('encrypted', 'salt', new Date(), new Date());
      const account = new Account('id', 'email', password, new Date(), new Date(), undefined);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(account.updatePassword('password', 'new password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return Promise<void>', async () => {
      const password = new Password('encrypted', 'salt', new Date(), new Date());
      const account = new Account('id', 'email', password, new Date(), new Date(), undefined);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      await expect(account.updatePassword('password', 'new password')).resolves.toEqual(undefined);
    });
  });

  describe('comparedPassword', () => {
    it('should return true when password is matched', async () => {
      const password = new Password('encrypted', 'salt', new Date(), new Date());
      const account = new Account('id', 'email', password, new Date(), new Date(), undefined);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      await expect(account.comparePassword('password')).resolves.toEqual(true);
    });

    it('should return false when password is not matched', async () => {
      const password = new Password('encrypted', 'salt', new Date(), new Date());
      const account = new Account('id', 'email', password, new Date(), new Date(), undefined);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(account.comparePassword('password')).resolves.toEqual(false);
    });
  });

  describe('delete', () => {
    it('should update account.deletedAt', () => {
      const password = new Password('encrypted', 'salt', new Date(), new Date());
      const account = new Account('id', 'email', password, new Date(), new Date(), undefined);

      account.delete();

      expect(account.deleted()).toEqual(true);
    });
  });
});
