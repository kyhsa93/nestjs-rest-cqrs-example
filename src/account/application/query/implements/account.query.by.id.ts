import { IQuery } from '@nestjs/cqrs';

export default class FindAccountByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
