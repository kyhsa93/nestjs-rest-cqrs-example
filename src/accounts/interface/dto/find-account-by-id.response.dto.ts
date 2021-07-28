import { ApiResponseProperty } from '@nestjs/swagger';

import { FindAccountByIdResult } from 'src/accounts/application/queries/find-account-by-id.result';

export class FindAccountByIdResponseDTO extends FindAccountByIdResult {
  @ApiResponseProperty()
  readonly id: string;

  @ApiResponseProperty()
  readonly name: string;

  @ApiResponseProperty()
  readonly balance: number;

  @ApiResponseProperty()
  readonly openedAt: Date;

  @ApiResponseProperty()
  readonly updatedAt: Date;

  @ApiResponseProperty()
  readonly closedAt?: Date;
}
