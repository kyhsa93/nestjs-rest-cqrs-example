import { IQueryResult } from '@nestjs/cqrs';

export class ItemInFindInvoicesResult {
  readonly id: string = '';
  readonly name: string = '';
  readonly status: number = 0;
}

export class FindInvoicesResult
  extends Array<ItemInFindInvoicesResult>
  implements IQueryResult {}
