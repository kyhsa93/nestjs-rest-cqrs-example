import { ApiModelProperty } from '@nestjs/swagger';

export class ReadAccountDTO {
  @ApiModelProperty()
  public readonly account_id: string;

  constructor(account_id: string) {
    this.account_id = account_id;
  }
}
