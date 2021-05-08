import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordBodyDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly current: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly data: string;
}
