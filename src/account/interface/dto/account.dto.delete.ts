import { ApiModelProperty } from '@nestjs/swagger';

export class DeleteAccountParamDTO {
  @ApiModelProperty()
  public readonly accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }
}

export class DeleteAccountBodyDTO {
  @ApiModelProperty()
  public readonly password: string;

  constructor(password: string) {
    this.password = password;
  }
}

export class DeleteAccountDTO {
  public readonly accountId: string;
  public readonly password: string;

  constructor(param: DeleteAccountParamDTO, body: DeleteAccountBodyDTO) {
    this.accountId = param.accountId;
    this.password = body.password;
  }
}
