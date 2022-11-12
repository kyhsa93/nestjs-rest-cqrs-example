import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class FindAccountsRequestQueryString {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false, default: 0, minimum: 0 })
  readonly skip: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  @ApiProperty({ required: false, default: 10, minimum: 1, maximum: 20 })
  readonly take: number = 10;
}
