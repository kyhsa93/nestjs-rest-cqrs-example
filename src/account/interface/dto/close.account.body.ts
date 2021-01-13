import { ApiProperty } from '@nestjs/swagger';

export default class CloseAccountBody {
  @ApiProperty({ example: 'testpassword' })
  public readonly password: string = '';
}
