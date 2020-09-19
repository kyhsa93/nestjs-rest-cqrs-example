export default class CreateAccountCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
