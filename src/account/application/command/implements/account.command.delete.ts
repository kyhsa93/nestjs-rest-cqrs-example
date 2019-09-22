import { DeleteAccountDTO } from "../../../interface/dto/account.dto.delete";

export class DeleteAccountCommand {
  public readonly accountId: string;
  public readonly password: string;

  constructor(dto: DeleteAccountDTO) {
    this.accountId = dto.accountId;
    this.password = dto.password;
  }
}
