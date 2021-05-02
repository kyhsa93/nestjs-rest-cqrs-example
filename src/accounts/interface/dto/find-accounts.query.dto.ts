import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class FindAccountsQueryDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  readonly offset: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit: number;
}
