import { ApiModelProperty } from '@nestjs/swagger';

export default class UpdateAccountParamDTO {
  @ApiModelProperty()
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
