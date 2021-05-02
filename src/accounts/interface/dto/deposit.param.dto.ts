import { IsNotEmpty, IsString } from 'class-validator';

export class DepositParamDTO {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
