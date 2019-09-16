import { DeleteAccountParamDTO } from './account.dto.delete.param';
import { DeleteAccountBodyDTO } from './account.dto.delete.body';

export class DeleteAccountDTO {
  public readonly accountId: string;
  public readonly password: string;

  constructor(param: DeleteAccountParamDTO, body: DeleteAccountBodyDTO) {
    this.accountId = param.accountId;
    this.password = body.password;
  }
}
