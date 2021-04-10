import { ICommand } from '@nestjs/cqrs';

export class OpenAccountCommand implements ICommand {
  constructor(readonly name: string, readonly password: string) {}
}
