export default class UpdateAccountCommand {
  constructor(
    public readonly id: string,
    public readonly oldPassword: string,
    public readonly newPassword: string,
  ) {}
}
