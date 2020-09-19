export class AccountUpdated {
  constructor(
    public readonly id: string,
    public readonly email: string,
  ) {}
}