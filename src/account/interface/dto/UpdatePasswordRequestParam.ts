import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length } from 'class-validator';

import { EntityId } from 'libs/DatabaseModule';

export class UpdatePasswordRequestParam {
  @IsAlphanumeric()
  @Length(32, 32)
  @ApiProperty({ example: new EntityId() })
  readonly accountId: string;
}
