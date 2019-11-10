import DeleteAccountDTO from "../../../interface/dto/account.dto.delete";

export class DeleteAccountCommand {
  public readonly id: string;
  public readonly password: string;

  constructor(dto: DeleteAccountDTO) {
    this.id = dto.id;
    this.password = dto.password;
  }
}
