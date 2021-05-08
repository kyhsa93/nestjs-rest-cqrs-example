import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class FindAccountsQueryDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiProperty()
  readonly offset: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  readonly limit: number;
}
