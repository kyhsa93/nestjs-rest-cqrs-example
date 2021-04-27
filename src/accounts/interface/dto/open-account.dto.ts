import { IsNotEmpty, IsString } from "class-validator";

export class OpenAccountDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
