import { ReadAccountDTO } from "../dto/account.dto.read";

export class ReadAccountQuery {
  public readonly accountId: string;

  constructor(dto: ReadAccountDTO) {
    this.accountId = dto.account_id;
  }
}
