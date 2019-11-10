import { ApiModelProperty } from '@nestjs/swagger';

export default class DeleteAccountParamDTO {
  @ApiModelProperty()
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
