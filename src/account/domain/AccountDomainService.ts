import { Account } from 'src/account/domain/Account';

export class RemittanceOptions {
  readonly account: Account;
  readonly receiver: Account;
  readonly amount: number;
}

export class AccountDomainService {
  remit({ account, receiver, amount }: RemittanceOptions): void {
    account.withdraw(amount);
    receiver.deposit(amount);
  }
}
