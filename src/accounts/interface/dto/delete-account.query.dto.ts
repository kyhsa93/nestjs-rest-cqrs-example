import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccountQueryDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}
