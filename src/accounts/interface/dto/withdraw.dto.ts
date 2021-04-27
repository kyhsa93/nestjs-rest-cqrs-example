import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class WithdrawDTO {
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @Transform(amount => Number(amount))
  @IsNumber()
  @Min(1)
  readonly amount: number;
}
