import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordBodyDTO {
  @IsString()
  @IsNotEmpty()
  readonly current: string;

  @IsString()
  @IsNotEmpty()
  readonly data: string;
}
