import { IQuery } from '@nestjs/cqrs';

export class FindAccountByIdQuery implements IQuery {
  constructor(readonly id: string) {}
}
