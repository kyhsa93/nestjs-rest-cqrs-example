import { ReadAccountListQuery } from "../../application/query/handlers/account.query.list";

export class ReadAccountListMapper {
  public readonly email: string;
  public readonly password: string;

  constructor(query: ReadAccountListQuery) {
    this.email = query.email;
    this.password = query.password;
  }
}
