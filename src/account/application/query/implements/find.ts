import { IQuery } from "@nestjs/cqrs";

export default class FindAccountsQuery implements IQuery {
  constructor(
    public readonly take: number,
    public readonly page: number,
    public readonly where?: { names: string[] },
  ){}
}
