import { ICommand } from "@nestjs/cqrs";

export default class RemittanceCommand implements ICommand {
  constructor(
    public readonly senderId: string,
    public readonly receiverId: string,
    public readonly password: string,
    public readonly amount: number,
  ) {}
}
