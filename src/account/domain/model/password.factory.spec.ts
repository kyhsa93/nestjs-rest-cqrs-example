import bcrypt from 'bcrypt';

import PasswordFactory from "src/account/domain/model/password.factory";
import Password from "src/account/domain/model/password.model";

describe('PasswordFactory', () => {
  describe('create', () => {
    it('should return Password', () => {
      const factory = new PasswordFactory();

      expect(factory.create('password')).toBeInstanceOf(Password);
    })
  })
});
