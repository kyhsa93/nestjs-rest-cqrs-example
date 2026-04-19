export class WithdrawnEvent {
  constructor(
    readonly accountId: string,
    readonly email: string,
  ) {}
}
