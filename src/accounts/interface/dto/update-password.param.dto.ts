import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdatePasswordParamDTO {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  readonly id: string;
}
