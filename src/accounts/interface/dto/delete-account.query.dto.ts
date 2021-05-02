import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccountQueryDTO {
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
