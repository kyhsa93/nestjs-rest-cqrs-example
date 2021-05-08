import { ICommand } from '@nestjs/cqrs';

export class CloseAccountCommand implements ICommand {
  constructor(readonly id: string, readonly password: string) {}
}
