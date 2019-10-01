import { ApiModelProperty } from '@nestjs/swagger';

export default class DeleteAccountParamDTO {
  @ApiModelProperty()
  public readonly accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }
}
