import { Invoice } from 'src/invoices/domain/entity/invoice';
import {
  InvoiceService,
  RemittanceOptions,
} from 'src/invoices/domain/service/service';

describe('InvoiceService', () => {
  describe('remit', () => {
    it('should run remit', () => {
      const service = new InvoiceService();

      const invoice = { withdraw: jest.fn() } as unknown as Invoice;
      const receiver = { deposit: jest.fn() } as unknown as Invoice;

      const options: RemittanceOptions = {
        invoice,
        receiver,
        password: 'password',
        amount: 1,
      };

      expect(service.remit(options)).toEqual(undefined);
      expect(invoice.withdraw).toBeCalledTimes(1);
      expect(invoice.withdraw).toBeCalledWith(options.amount, options.password);
      expect(receiver.deposit).toBeCalledTimes(1);
      expect(receiver.deposit).toBeCalledWith(options.amount);
    });
  });
});
