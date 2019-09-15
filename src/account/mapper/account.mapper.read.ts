import { IsNull, FindOperator } from "typeorm";

export class ReadAccountMapper {
  public readonly account_id: string;
  public readonly deleted_at: FindOperator<any>;

  constructor(accountId: string) {
    this.account_id = accountId
    this.deleted_at = IsNull();
  }
}
