import { v4 as uuid } from 'uuid';
import { CreateAccountDTO } from "../dto/account.dto.create";

export class CreateAccountCommand {
  public readonly email: string;
  public readonly password: string;
  public readonly name: string;
  public readonly active: boolean = true;
  public readonly account_id: string = (() => {
    const tokens = uuid().split('-');
    return `${tokens[2]}${tokens[1]}${tokens[0]}${tokens[3]}${tokens[4]}`;
  })();

  constructor(createAccountDto: CreateAccountDTO) {
    this.email = createAccountDto.email;
    this.password = createAccountDto.password;
    this.name = createAccountDto.name;
  }
}