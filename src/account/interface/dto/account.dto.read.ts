import { ApiModelProperty } from '@nestjs/swagger';

export default class ReadAccountDTO {
  @ApiModelProperty()
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
