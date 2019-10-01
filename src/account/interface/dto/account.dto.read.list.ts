import { ApiModelPropertyOptional } from '@nestjs/swagger';

export default class ReadAccountListDTO {
  @ApiModelPropertyOptional()
  public readonly email: string;

  @ApiModelPropertyOptional()
  public readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
