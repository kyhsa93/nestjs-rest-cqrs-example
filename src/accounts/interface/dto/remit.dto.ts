import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class RemitDTO {
  @IsString()
  @IsNotEmpty()
  readonly receiverId: string;

  @Transform(amount => Number(amount))
  @IsNumber()
  @Min(1)
  readonly amount: number;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
