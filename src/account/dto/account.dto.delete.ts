import { DeleteAccountParamDTO } from './account.dto.delete.param';
import { DeleteAccountBodyDTO } from './account.dto.delete.body';

export class DeleteAccountDTO {
  public readonly account_id: string;
  public readonly password: string;

  constructor(param: DeleteAccountParamDTO, body: DeleteAccountBodyDTO) {
    this.account_id = param.account_id;
    this.password = body.password;
  }
}
