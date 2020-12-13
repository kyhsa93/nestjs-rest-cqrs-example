import { IQueryResult } from "@nestjs/cqrs";

export interface AccountFindConditions {
  readonly take: number;
  readonly page: number;
  readonly where?: AccountWhereConditions;
}

export interface AccountWhereConditions {
  readonly emails: string[];
}

export interface Account extends IQueryResult {
  readonly id: string;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt?: Date;
}

export interface Accounts
  extends Array<{
    readonly id: string;
    readonly email: string;
    readonly createdAt: Date;
  }>, IQueryResult {}

export interface AccountsAndCount extends IQueryResult {
  readonly count: number;
  readonly data: { 
    readonly id: string;
    readonly email: string;
    readonly createdAt: Date;
   }[]
}

export interface Query {
  findById(id: string): Promise<undefined | Account>;
  findAndCount(conditions: AccountFindConditions): Promise<AccountsAndCount>;
}
