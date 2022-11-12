import { ICommand } from '@nestjs/cqrs';

export class WithdrawCommand implements ICommand {
  constructor(readonly accountId: string, readonly amount: number) {}
}
