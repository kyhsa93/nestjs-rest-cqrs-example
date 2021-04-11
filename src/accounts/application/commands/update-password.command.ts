import { ICommand } from '@nestjs/cqrs';

export class UpdatePasswordCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly current: string,
    readonly data: string,
  ) {}
}
