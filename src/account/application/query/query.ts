import { IQueryResult } from "@nestjs/cqrs";

export interface AccountFindConditions {
  readonly take: number;
  readonly page: number;
  readonly where?: AccountWhereConditions;
}

export interface AccountWhereConditions {
  readonly names: string[];
}

export interface Account extends IQueryResult {
  readonly id: string;
  readonly name: string;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt?: Date;
}

export interface Accounts
  extends Array<{
    readonly id: string;
    readonly name: string;
    readonly openedAt: Date;
  }>, IQueryResult {}

export interface AccountsAndCount extends IQueryResult {
  readonly count: number;
  readonly data: { 
    readonly id: string;
    readonly name: string;
    readonly openedAt: Date;
   }[]
}

export interface Query {
  findById(id: string): Promise<undefined | Account>;
  findAndCount(conditions: AccountFindConditions): Promise<AccountsAndCount>;
}
