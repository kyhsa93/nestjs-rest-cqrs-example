import DeleteAccountParamDTO from './account.dto.delete.param';
import DeleteAccountBodyDTO from './account.dto.delete.body';

export default class DeleteAccountDTO {
  public readonly id: string;

  public readonly password: string;

  constructor(param: DeleteAccountParamDTO, body: DeleteAccountBodyDTO) {
    this.id = param.id;
    this.password = body.password;
  }
}
