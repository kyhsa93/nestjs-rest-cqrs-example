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
      expect(account.withdraw).toHaveBeenCalledTimes(1);
      expect(account.withdraw).toHaveBeenCalledWith(options.amount);
      expect(receiver.deposit).toHaveBeenCalledTimes(1);
      expect(receiver.deposit).toHaveBeenCalledWith(options.amount);
    });
  });
});
