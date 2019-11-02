import { ApiModelProperty } from '@nestjs/swagger';

export default class ReadAccountListDTO {
  @ApiModelProperty({ example: 'test@test.com' })
  public readonly email: string;

  @ApiModelProperty({ example: 'testpassword' })
  public readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
