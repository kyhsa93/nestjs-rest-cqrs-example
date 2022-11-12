import { ICommand } from '@nestjs/cqrs';

export class UpdatePasswordCommand implements ICommand {
  constructor(readonly accountId: string, readonly password: string) {}
}
