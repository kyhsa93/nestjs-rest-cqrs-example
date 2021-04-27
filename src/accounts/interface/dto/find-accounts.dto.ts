import { Transform } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class FindAccountsDTO {
  @Transform(offset => Number(offset))
  @IsNumber()
  @Min(0)
  readonly offset: number;

  @Transform(limit => Number(limit))
  @IsNumber()
  @Min(1)
  readonly limit: number;
}
