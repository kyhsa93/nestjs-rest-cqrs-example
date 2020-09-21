import { ApiProperty } from '@nestjs/swagger';

export default class CreateAccountBody {
  @ApiProperty({ example: 'test@test.com' })
  public readonly email: string;

  @ApiProperty({ example: 'testpassword' })
  public readonly password: string;

  @ApiProperty({ example: 'tester' })
  public readonly name: string;

  constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}
