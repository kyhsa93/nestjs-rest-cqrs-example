import { Account } from 'src/account/domain/account';
import { AccountService, RemittanceOptions } from 'src/account/domain/service';

describe('AccountService', () => {
  describe('remit', () => {
    it('should run remit', () => {
      const service = new AccountService();

      const account = { withdraw: jest.fn() } as unknown as Account;
      const receiver = { deposit: jest.fn() } as unknown as Account;

      const options: RemittanceOptions = {
        account,
        receiver,
        password: 'password',
        amount: 1,
      };

      expect(service.remit(options)).toEqual(undefined);
      expect(account.withdraw).toBeCalledTimes(1);
      expect(account.withdraw).toBeCalledWith(options.amount, options.password);
      expect(receiver.deposit).toBeCalledTimes(1);
      expect(receiver.deposit).toBeCalledWith(options.amount);
    });
  });
});
