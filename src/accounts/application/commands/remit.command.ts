import { ICommand } from '@nestjs/cqrs';

export class RemitCommand implements ICommand {
  constructor(
    readonly senderId: string,
    readonly receiverId: string,
    readonly amount: number,
    readonly password: string,
  ) {}
}
