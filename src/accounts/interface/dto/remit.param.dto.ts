import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RemitParamDTO {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  readonly id: string;
}
