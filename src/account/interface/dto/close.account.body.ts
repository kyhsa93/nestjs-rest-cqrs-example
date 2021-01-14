import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class CloseAccountBody {
  @ApiProperty({ example: 'testpassword' })
  @IsString()
  public readonly password: string = '';
}
