import { ICommand } from '@nestjs/cqrs';

export default class OpenAccountCommand implements ICommand {
  constructor(public readonly name: string, public readonly password: string) {}
}
