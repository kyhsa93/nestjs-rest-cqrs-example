import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordParamDTO {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
