import AccountFactory from '@src/account/domain/factory';
import Account, { AnemicAccount } from '@src/account/domain/model/account';
import { AnemicPassword } from '@src/account/domain/model/password';

describe('AccountFactory', () => {
  describe('create', () => {
    it('should return Account', () => {
      const factory = new AccountFactory();

      const id = 'accountId';
      const email = 'accountEmail';
      const password = 'accountPassword';

      expect(factory.create(id, email, password)).toBeInstanceOf(Account);
    });
  });

  describe('reconstitute', () => {
    it('should return Account', () => {
      const factory = new AccountFactory();

      const anemicPassword: AnemicPassword = {
        encrypted: 'passwordHash',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      };

      const anemic: AnemicAccount = {
        id: 'accountId',
        email: 'accountEmail',
        password: anemicPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
      };

      expect(factory.reconstitute(anemic)).toBeInstanceOf(Account);
    });
  });
});
