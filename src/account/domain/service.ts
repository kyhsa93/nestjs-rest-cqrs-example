import Account from "@src/account/domain/model/account";

export interface RemittanceOptions {
  readonly password: string;
  readonly sender: Account;
  readonly receiver: Account;
  readonly amount: number;
}

export default class AccountDomainService {
  public remit(options: RemittanceOptions): void {
    const { sender, receiver, password, amount } = options;
    sender.withdraw(amount, password);
    receiver.deposit(amount, password);
  }
}
