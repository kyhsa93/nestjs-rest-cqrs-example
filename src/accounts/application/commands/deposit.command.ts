import { ICommand } from '@nestjs/cqrs';

export class DepositCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly password: string,
    readonly amount: number,
  ) {}
}
