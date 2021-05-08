import { Account } from 'src/accounts/domain/account';

export class RemittanceOptions {
  readonly password: string;
  readonly sender: Account;
  readonly receiver: Account;
  readonly amount: number;
}

export class AccountService {
  remit({ sender, receiver, password, amount }: RemittanceOptions): void {
    sender.withdraw(amount, password);
    receiver.deposit(amount);
  }
}
