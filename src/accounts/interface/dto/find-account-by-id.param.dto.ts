import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindAccountByIdParamDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly id: string;
}
