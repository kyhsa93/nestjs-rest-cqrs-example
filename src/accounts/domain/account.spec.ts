import { Account, AccountAttributes } from 'src/accounts/domain/account';

describe('Account', () => {
  describe('attributes', () => {
    it('should return AccountAttributes', () => {
      const accountAttributes: AccountAttributes = {
        id: 'accountId',
        name: 'tester',
        password: 'password',
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
      };

      const account = new Account(accountAttributes);

      const result = account.attributes();

      expect(result).toEqual(accountAttributes);
    });
  });
});
