import bcrypt from 'bcrypt';

import PasswordFactory from "src/account/domain/model/password.factory";
import Password from "src/account/domain/model/password.model";

describe('PasswordFactory', () => {
  describe('create', () => {
    it('should return Passwrod', () => {
      const factory = new PasswordFactory();

      const salt = bcrypt.genSaltSync();
      const encrypted = bcrypt.hashSync('password', salt);
      const password = new Password(encrypted, salt, new Date(), new Date());

      expect(factory.create('password')).toEqual(password);
    })
  })
});
