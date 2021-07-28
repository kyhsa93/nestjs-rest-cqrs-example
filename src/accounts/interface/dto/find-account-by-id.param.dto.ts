import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindAccountByIdParamDTO {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  readonly id: string;
}
