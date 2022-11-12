import { ApiProperty } from '@nestjs/swagger';

import { EntityId } from 'libs/DatabaseModule';

import { FindNotificationResult } from 'src/notification/application/query/FindNotificationResult';

class Notification {
  @ApiProperty({ example: new EntityId() })
  readonly id: string;

  @ApiProperty({ example: 'test@test.com' })
  readonly to: string;

  @ApiProperty({ example: 'This is subject' })
  readonly subject: string;

  @ApiProperty({ example: 'this is very long content...' })
  readonly content: string;

  @ApiProperty({ example: new Date() })
  readonly createdAt: Date;
}

export class FindNotificationResponseDto extends FindNotificationResult {
  @ApiProperty({ type: [Notification] })
  readonly notifications: Notification[];
}
