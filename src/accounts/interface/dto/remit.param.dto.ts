import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemitParamDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly id: string;
}
