import { ApiModelProperty } from '@nestjs/swagger';

export class DeleteAccountBodyDTO {
  @ApiModelProperty()
  public readonly password: string;

  constructor(password: string) {
    this.password = password;
  }
}
