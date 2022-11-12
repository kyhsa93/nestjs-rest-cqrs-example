import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length } from 'class-validator';

import { EntityId } from 'libs/DatabaseModule';

export class FindAccountNotificationRequestParam {
  @ApiProperty({ example: new EntityId() })
  @IsAlphanumeric()
  @Length(32, 32)
  readonly accountId: string;
}
