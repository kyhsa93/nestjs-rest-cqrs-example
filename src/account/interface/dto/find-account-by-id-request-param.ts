import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length } from 'class-validator';

import { EntityId } from 'libs/database-module';

export class FindAccountByIdRequestParam {
  @IsAlphanumeric()
  @Length(32, 32)
  @ApiProperty({ example: new EntityId().toString() })
  readonly accountId: string;
}
