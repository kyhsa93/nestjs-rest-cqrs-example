import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccountParamDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly id: string;
}
