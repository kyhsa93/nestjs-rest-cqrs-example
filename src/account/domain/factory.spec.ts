import AccountFactory from '@src/account/domain/factory';
import Account, { AnemicAccount } from '@src/account/domain/model/account';
import { AnemicPassword } from '@src/account/domain/model/password';

describe('AccountFactory', () => {
  describe('create', () => {
    it('should return Account', () => {
      const factory = new AccountFactory();

      const id = 'accountId';
      const name = 'accountName';
      const password = 'accountPassword';

      expect(factory.create(id, name, password)).toBeInstanceOf(Account);
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
        name: 'accountName',
        password: anemicPassword,
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      };

      expect(factory.reconstitute(anemic)).toBeInstanceOf(Account);
    });
  });
});
