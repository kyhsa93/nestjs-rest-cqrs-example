export default class AccountUserDTO {
  constructor(
    public readonly accountId: string,
    public readonly email: string,
    public readonly name: string,
  ) {}
}
