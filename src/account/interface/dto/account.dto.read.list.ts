import { ApiProperty } from '@nestjs/swagger';

export default class ReadAccountListDTO {
  @ApiProperty({ example: 'test@test.com' })
  public readonly email: string;

  @ApiProperty({ example: 'testpassword' })
  public readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
