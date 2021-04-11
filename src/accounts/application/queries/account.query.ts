export class Account {
  readonly id: string;
}

export class Accounts extends Array<{
  readonly id: string;
}> {}

export interface AccountQuery {
  findById: (id: string) => Promise<Account>;
  find: (offset: number, limit: number) => Promise<Accounts>;
}
