import bcrypt from 'bcrypt-nodejs';
import Account from './account.model';
import { ComparePasswordEvent } from '../../application/event/implements/account.event.compare-password';

describe('AccountModel', () => {
  let accountModel: Account;
  let comparePasswordEvent: ComparePasswordEvent;

  describe('comparePassword', () => {
    accountModel = new Account('id', 'accountName', 'accountEmail', 'accountPassword', true);
    comparePasswordEvent = new ComparePasswordEvent(accountModel.id);

    it('execute comparePassword method', () => {
      jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => true);
      const spy = jest.spyOn(accountModel, 'apply').mockImplementation(() => true);
      accountModel.comparePassword('password');
      expect(spy).toBeCalledWith(comparePasswordEvent);
    });
  });
});
