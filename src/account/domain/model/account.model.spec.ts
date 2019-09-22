import bcrypt from 'bcrypt-nodejs';
import { Account } from './account.model';
import { ComparePasswordEvent } from '../../application/event/implements/account.event.compare-password';

describe('AccountModel', () => {
  let accountModel: Account;
  let comparePasswordEvent: ComparePasswordEvent;

  afterAll(async () => close());

  describe('comparePassword', () => {
    accountModel = new Account('accountId', 'accountName', 'accountEmail', 'accountPassword', true);
    comparePasswordEvent = new ComparePasswordEvent(accountModel.accountId);

    it('execute comparePassword method', () => {
      jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => true);
      jest.spyOn(accountModel, 'apply').mockImplementation(() => true);
      accountModel.comparePassword('password');
      expect(accountModel.apply).toBeCalledWith(comparePasswordEvent);
    });
  });
});
