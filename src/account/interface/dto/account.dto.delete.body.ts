import { ApiModelProperty } from '@nestjs/swagger';

export default class DeleteAccountBodyDTO {
  @ApiModelProperty({ example: 'testpassword' })
  public readonly password: string;

  constructor(password: string) {
    this.password = password;
  }
}
