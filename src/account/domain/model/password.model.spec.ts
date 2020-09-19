import bcrypt from 'bcrypt';

import Password from "src/account/domain/model/password.model";

describe('Password', () => {
  describe('compare', () => {
    it('should return false when password is not matched', () => {
      const password = new Password('encrypted', 'salt', new Date(), new Date());

      expect(password.compare('password')).toEqual(false);
    });

    it('should return true when password is matched', () => {
      const salt = bcrypt.genSaltSync();
      const encrypted = bcrypt.hashSync('password', salt);
      const password = new Password(encrypted, 'salt', new Date(), new Date());

      expect(password.compare('password')).toEqual(true);
    })
  });
});
