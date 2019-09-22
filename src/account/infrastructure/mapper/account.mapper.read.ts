import { IsNull, FindOperator } from "typeorm";

export class ReadAccountMapper {
  public readonly accountId: string;
  public readonly deletedAt: FindOperator<any>;

  constructor(accountId: string) {
    this.accountId = accountId
    this.deletedAt = IsNull();
  }
}
