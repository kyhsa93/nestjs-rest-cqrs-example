import { IsNotEmpty, IsString } from 'class-validator';

export class FindAccountByIdParamDTO {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
