import { Account } from 'src/accounts/domain/account';

export interface RemittanceOptions {
  readonly password: string;
  readonly sender: Account;
  readonly receiver: Account;
  readonly amount: number;
}

export class AccountDomainService {
  remit({ sender, receiver, password, amount }: RemittanceOptions): void {
    sender.withdraw(amount, password);
    receiver.deposit(amount, password);
  }
}
