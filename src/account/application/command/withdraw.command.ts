import { ICommand } from '@nestjs/cqrs';

class Properties {
  readonly id: string;
  readonly password: string;
  readonly amount: number;
}

export class WithdrawCommand extends Properties implements ICommand {
  constructor(properties: Properties) {
    super();
    Object.assign(this, properties);
  }
}
