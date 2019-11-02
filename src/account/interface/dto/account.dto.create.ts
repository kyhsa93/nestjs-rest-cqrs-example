import { ApiModelProperty } from '@nestjs/swagger';

export default class CreateAccountDTO {
  @ApiModelProperty({ example: 'test@test.com' })
  public readonly email: string;

  @ApiModelProperty({ example: 'testpassword' })
  public readonly password: string;

  @ApiModelProperty({ example: 'tester' })
  public readonly name: string;

  constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}
