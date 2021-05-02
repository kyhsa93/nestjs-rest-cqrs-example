import { IsNotEmpty, IsString } from 'class-validator';

export class RemitParamDTO {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
