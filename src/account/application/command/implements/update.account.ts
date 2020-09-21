import { ICommand } from '@nestjs/cqrs';

export default class UpdateAccountCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly oldPassword: string,
    public readonly newPassword: string,
  ) {}
}
