import { ICommand } from '@nestjs/cqrs';

export class RemitCommand implements ICommand {
  constructor(
    readonly accountId: string,
    readonly receiverId: string,
    readonly amount: number,
  ) {}
}
