import { IsNotEmpty, IsString } from 'class-validator';

export class WithdrawParamDTO {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
