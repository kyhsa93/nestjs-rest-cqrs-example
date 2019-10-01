import { IsNull, FindOperator } from 'typeorm';

export default class ReadAccountMapper {
  public readonly accountId: string;

  public readonly deletedAt: FindOperator<string>;

  constructor(accountId: string) {
    this.accountId = accountId;
    this.deletedAt = IsNull();
  }
}
