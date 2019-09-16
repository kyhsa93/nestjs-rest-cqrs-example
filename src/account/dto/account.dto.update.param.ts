import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateAccountParamDTO {
  @ApiModelProperty()
  public readonly accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }
}
