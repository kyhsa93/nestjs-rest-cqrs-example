import { ApiProperty } from '@nestjs/swagger';

import { EntityId } from 'libs/database/database-module';

import { FindAccountsResult } from 'src/account/application/query/find-accounts-result';

class Account {
  @ApiProperty({ example: new EntityId() })
  readonly id: string;

  @ApiProperty({ example: 'young' })
  readonly name: string;

  @ApiProperty({ example: 100 })
  readonly balance: number;
}

export class FindAccountsResponseDto extends FindAccountsResult {
  @ApiProperty({ type: [Account] })
  override readonly accounts: Account[];
}
