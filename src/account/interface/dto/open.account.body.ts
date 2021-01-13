import { ApiProperty } from '@nestjs/swagger';

export default class OpenAccountBody {
  @ApiProperty({ example: 'name' })
  public readonly name: string = '';

  @ApiProperty({ example: 'testpassword' })
  public readonly password: string = '';
}
