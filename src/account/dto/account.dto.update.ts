import { UpdateAccountParamDTO } from './account.dto.update.param';
import { UpdateAccountBodyDTO } from './account.dto.update.body';

export class UpdateAccountDTO {
  public readonly accountId: string
  public readonly oldPassword: string;
  public readonly newPassword: string;

  constructor(param: UpdateAccountParamDTO, body: UpdateAccountBodyDTO) {
    this.accountId = param.account_id;
    this.oldPassword = body.old_password;
    this.newPassword = body.new_password;
  }
}
