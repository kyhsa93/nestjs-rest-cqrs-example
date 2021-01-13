import bcrypt from 'bcrypt';

import Account from "@src/account/domain/model/account";
import Password from "@src/account/domain/model/password";
import AccountDomainService from "@src/account/domain/service";

describe('AccountDomainService', () => {
  describe('remit', () => {
    it('should return void when success', () => {
      const password = new Password({
        encrypted: 'encrypted',
        salt: 'salt',
        createdAt: new Date(),
        comparedAt: new Date(),
      });

      const sender = new Account({
        id: 'id',
        name: 'name',
        password,
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      });

      const receiver = new Account({
        id: 'id',
        name: 'name',
        password,
        balance: 0,
        openedAt: new Date(),
        updatedAt: new Date(),
        closedAt: undefined,
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      const service = new AccountDomainService();

      expect(service.remit({ sender, receiver, password: 'password', amount: 0 })).toEqual(undefined);
    })
  });
});
