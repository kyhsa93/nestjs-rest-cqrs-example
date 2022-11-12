import { ICommand } from '@nestjs/cqrs';

export class LockAccountCommand implements ICommand {
  constructor(readonly accountId: string) {}
}
