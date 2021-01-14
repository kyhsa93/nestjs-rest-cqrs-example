import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class OpenAccountBody {
  @ApiProperty({ example: 'name' })
  @IsString()
  public readonly name: string = '';

  @ApiProperty({ example: 'testpassword' })
  @IsString()
  public readonly password: string = '';
}
