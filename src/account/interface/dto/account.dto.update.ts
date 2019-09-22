import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateAccountParamDTO {
  @ApiModelProperty()
  public readonly accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }
}


export class UpdateAccountBodyDTO {
  @ApiModelProperty()
  public readonly newPassword: string;

  @ApiModelProperty()
  public readonly oldPassword: string;

  constructor(newPassword: string, oldPassword: string) {
    this.newPassword = newPassword;
    this.oldPassword = oldPassword;
  }
}

export class UpdateAccountDTO {
  public readonly accountId: string
  public readonly oldPassword: string;
  public readonly newPassword: string;

  constructor(param: UpdateAccountParamDTO, body: UpdateAccountBodyDTO) {
    this.accountId = param.accountId;
    this.oldPassword = body.oldPassword;
    this.newPassword = body.newPassword;
  }
}
