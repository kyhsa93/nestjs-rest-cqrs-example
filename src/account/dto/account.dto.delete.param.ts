import { ApiModelProperty } from '@nestjs/swagger';

export class DeleteAccountParamDTO {
  @ApiModelProperty()
  public readonly account_id: string;

  constructor(accountId: string) {
    this.account_id = accountId;
  }
}
