import { ApiModelProperty } from '@nestjs/swagger';

export default class UpdateAccountParamDTO {
  @ApiModelProperty()
  public readonly accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }
}
