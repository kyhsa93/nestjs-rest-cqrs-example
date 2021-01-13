import { ICommand } from '@nestjs/cqrs';

export default class UpdateAccountCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly password: string,
    public readonly newPassword: string,
  ) {}
}
