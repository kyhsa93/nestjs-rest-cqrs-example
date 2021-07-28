import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeleteAccountParamDTO {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  readonly id: string;
}
