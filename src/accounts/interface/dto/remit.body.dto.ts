import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class RemitBodyDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly receiverId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  readonly amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}
