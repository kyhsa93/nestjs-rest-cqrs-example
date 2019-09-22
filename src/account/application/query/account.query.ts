import { ReadAccountDTO } from "../../interface/dto/account.dto.read";

export class ReadAccountQuery {
  public readonly accountId: string;

  constructor(dto: ReadAccountDTO) {
    this.accountId = dto.accountId;
  }
}
