import { ICommand } from '@nestjs/cqrs';

export class DepositCommand implements ICommand {
  constructor(readonly accountId: string, readonly amount: number) {}
}
