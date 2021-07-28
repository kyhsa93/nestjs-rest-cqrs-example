import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DepositParamDTO {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  readonly id: string;
}
