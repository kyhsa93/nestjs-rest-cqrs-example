import { ReadAccountListQuery } from '../../application/query/implements/account.query.list';

export default class ReadAccountListMapper {
  public readonly email: string;

  public readonly password: string;

  constructor(query: ReadAccountListQuery) {
    this.email = query.email;
    this.password = query.password;
  }
}
