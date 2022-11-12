import { Account } from 'src/account/domain/Account';
import {
  AccountDomainService,
  RemittanceOptions,
} from 'src/account/domain/AccountDomainService';

describe('AccountDomainService', () => {
  describe('remit', () => {
    it('should run remit', () => {
      const service = new AccountDomainService();

      const account = { withdraw: jest.fn() } as unknown as Account;
      const receiver = { deposit: jest.fn() } as unknown as Account;

      const options: RemittanceOptions = {
        account,
        receiver,
        amount: 1,
      };

      expect(service.remit(options)).toEqual(undefined);
      expect(account.withdraw).toBeCalledTimes(1);
      expect(account.withdraw).toBeCalledWith(options.amount);
      expect(receiver.deposit).toBeCalledTimes(1);
      expect(receiver.deposit).toBeCalledWith(options.amount);
    });
  });
});
