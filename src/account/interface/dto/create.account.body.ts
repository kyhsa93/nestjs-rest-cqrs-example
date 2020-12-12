import { ApiProperty } from '@nestjs/swagger';

export default class CreateAccountBody {
  @ApiProperty({ example: 'test@test.com' })
  public readonly email: string = '';

  @ApiProperty({ example: 'testpassword' })
  public readonly password: string = '';
}
