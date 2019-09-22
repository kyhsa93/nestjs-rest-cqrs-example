import { ApiModelProperty } from '@nestjs/swagger';

export class ReadAccountDTO {
  @ApiModelProperty()
  public readonly accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }
}
