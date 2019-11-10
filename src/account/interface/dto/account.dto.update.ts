import UpdateAccountParamDTO from './account.dto.update.param';
import UpdateAccountBodyDTO from './account.dto.update.body';

export default class UpdateAccountDTO {
  public readonly id: string;

  public readonly oldPassword: string;

  public readonly newPassword: string;

  constructor(param: UpdateAccountParamDTO, body: UpdateAccountBodyDTO) {
    this.id = param.id;
    this.oldPassword = body.oldPassword;
    this.newPassword = body.newPassword;
  }
}
