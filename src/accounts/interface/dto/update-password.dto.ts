import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDTO {
  @IsString()
  @IsNotEmpty()
  readonly current: string;

  @IsString()
  @IsNotEmpty()
  readonly data: string;
}
