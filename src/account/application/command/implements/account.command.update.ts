import UpdateAccountDTO from "../../../interface/dto/account.dto.update";

export class UpdateAccountCommand {
  public readonly id: string;
  public readonly oldPassword: string;
  public readonly newPassword: string;

  constructor(dto: UpdateAccountDTO) {
    this.id = dto.id;
    this.newPassword = dto.newPassword;
    this.oldPassword = dto.oldPassword;
  }
}