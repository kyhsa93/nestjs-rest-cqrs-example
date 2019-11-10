import moment from 'moment';
import Account from '../../domain/model/account.model';

export default class DeleteAccountMapper {
  public readonly id: string;

  public readonly name: string;

  public readonly email: string;

  public readonly password: string;

  public readonly deletedAt: string;

  constructor(account: Account) {
    this.id = account.id;
    this.name = account.name;
    this.email = account.email;
    this.password = account.password;
    this.deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  }
}
