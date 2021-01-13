import { ICommand } from '@nestjs/cqrs';

export default class DeleteAccountCommand implements ICommand {
  constructor(public readonly id: string, public readonly password: string) {}
}
