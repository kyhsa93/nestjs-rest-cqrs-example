export default class DeleteAccountCommand {
  constructor(public readonly id: string, public readonly password: string) {}
}
