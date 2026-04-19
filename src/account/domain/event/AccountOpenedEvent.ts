export class AccountOpenedEvent {
  constructor(
    readonly accountId: string,
    readonly email: string,
  ) {}
}
