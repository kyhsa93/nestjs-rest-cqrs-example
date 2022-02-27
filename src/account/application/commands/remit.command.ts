import { ICommand } from '@nestjs/cqrs';

class Properties {
  readonly id: string;
  readonly receiverId: string;
  readonly amount: number;
  readonly password: string;
}

export class RemitCommand extends Properties implements ICommand {
  constructor(properties: Properties) {
    super();
    Object.assign(this, properties);
  }
}
