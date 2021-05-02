import { IsNotEmpty, IsString } from 'class-validator';

export class OpenAccountBodyDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
