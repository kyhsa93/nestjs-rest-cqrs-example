import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class CloseAccountPathParam {
  @ApiProperty()
  @IsString()
  public readonly id!: string;
}
