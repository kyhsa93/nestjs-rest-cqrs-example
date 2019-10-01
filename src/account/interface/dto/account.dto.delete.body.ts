import { ApiModelProperty } from '@nestjs/swagger';

export default class DeleteAccountBodyDTO {
  @ApiModelProperty()
  public readonly password: string;

  constructor(password: string) {
    this.password = password;
  }
}
