import { IsNull, FindOperator } from 'typeorm';

export default class ReadAccountMapper {
  public readonly id: string;

  public readonly deletedAt: FindOperator<string>;

  constructor(id: string) {
    this.id = id;
    this.deletedAt = IsNull();
  }
}
