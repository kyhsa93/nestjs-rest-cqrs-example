import PasswordFactory from '@src/account/domain/factory/password';
import Password from '@src/account/domain/model/password';

describe('PasswordFactory', () => {
  describe('create', () => {
    it('should return Password', () => {
      const factory = new PasswordFactory();

      expect(factory.create('password')).toBeInstanceOf(Password);
    });
  });
});
