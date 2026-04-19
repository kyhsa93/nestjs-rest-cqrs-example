export class AccountClosedEvent {
  constructor(
    readonly accountId: string,
    readonly email: string,
  ) {}
}
