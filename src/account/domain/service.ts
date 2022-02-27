import { Account } from 'src/account/domain/account';

export class RemittanceOptions {
  readonly password: string;
  readonly account: Account;
  readonly receiver: Account;
  readonly amount: number;
}

export class AccountService {
  remit({ account, receiver, password, amount }: RemittanceOptions): void {
    account.withdraw(amount, password);
    receiver.deposit(amount);
  }
}
