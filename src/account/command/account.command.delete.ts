import { DeleteAccountDTO } from "../dto/account.dto.delete";

export class DeleteAccountCommand {
  public readonly accountId: string;
  public readonly password: string;

  constructor(dto: DeleteAccountDTO) {
    this.accountId = dto.account_id;
    this.password = dto.password;
  }
}
