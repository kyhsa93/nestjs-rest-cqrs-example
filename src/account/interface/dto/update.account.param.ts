import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class UpdateAccountPathParam {
  @ApiProperty()
  @IsString()
  public readonly id: string = '';
}
