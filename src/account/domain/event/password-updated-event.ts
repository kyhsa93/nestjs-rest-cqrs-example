export class PasswordUpdatedEvent {
  constructor(
    readonly accountId: string,
    readonly email: string,
  ) {}
}
