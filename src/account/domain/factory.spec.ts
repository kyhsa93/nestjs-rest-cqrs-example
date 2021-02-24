import AccountFactory from '@src/account/domain/factory';
import Account, { AccountAttributes } from '@src/account/domain/model/account';
import { PasswordAttributes } from '@src/account/domain/model/password';

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

      const passwordAttributes: PasswordAttributes = {
        encrypted: 'passwordHash',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      };

      const attributes: AccountAttributes = {
        id: 'accountId',
        name: 'accountName',
        password: passwordAttributes,
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      };

      expect(factory.reconstitute(attributes)).toBeInstanceOf(Account);
    });
  });
});
