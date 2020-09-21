import { ICommand } from '@nestjs/cqrs';

export default class CreateAccountCommand implements ICommand {
  constructor(public readonly email: string, public readonly password: string) {}
}
