import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccountParamDTO {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
