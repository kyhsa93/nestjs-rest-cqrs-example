import { ApiModelProperty } from "@nestjs/swagger";

export class CreateAccountDTO {
  @ApiModelProperty()
  public readonly email: string;

  @ApiModelProperty()
  public readonly password: string;

  @ApiModelProperty()
  public readonly name: string;

  constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name
  }
}
