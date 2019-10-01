import UpdateAccountDTO from "../../../interface/dto/account.dto.update";

export class UpdateAccountCommand {
  public readonly accountId: string;
  public readonly oldPassword: string;
  public readonly newPassword: string;

  constructor(dto: UpdateAccountDTO) {
    this.accountId = dto.accountId;
    this.newPassword = dto.newPassword;
    this.oldPassword = dto.oldPassword;
  }
}