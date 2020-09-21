import { ApiProperty } from '@nestjs/swagger';

export default class DeleteAccountBody {
  @ApiProperty({ example: 'testpassword' })
  public readonly password: string;

  constructor(password: string) {
    this.password = password;
  }
}
