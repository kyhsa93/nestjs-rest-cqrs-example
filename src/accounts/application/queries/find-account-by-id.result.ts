import { IQueryResult } from '@nestjs/cqrs';

export class FindAccountByIdResult implements IQueryResult {
  readonly id: string;
}
