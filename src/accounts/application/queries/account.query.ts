export class Account {
  readonly id: string;
  readonly name: string;
  readonly password: string;
  readonly balance: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt?: Date;
}

export class ItemInAccounts {
  readonly id: string;
  readonly name: string;
  readonly password: string;
  readonly balance: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt?: Date;
}

export class Accounts extends Array<ItemInAccounts> {}

export interface AccountQuery {
  findById: (id: string) => Promise<Account>;
  find: (offset: number, limit: number) => Promise<Accounts>;
}
