import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class WithdrawBodyDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  readonly amount: number;
}
