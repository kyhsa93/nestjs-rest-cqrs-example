import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class WithdrawParamDTO {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  readonly id: string;
}
