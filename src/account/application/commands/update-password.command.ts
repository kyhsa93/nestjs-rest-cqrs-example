import { ICommand } from '@nestjs/cqrs';

class Properties {
  readonly id: string;
  readonly password: string;
  readonly newPassword: string;
}

export class UpdatePasswordCommand extends Properties implements ICommand {
  constructor(properties: Properties) {
    super();
    Object.assign(this, properties);
  }
}
