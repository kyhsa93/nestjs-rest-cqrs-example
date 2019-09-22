import { CreateAccountDTO } from "../../../interface/dto/account.dto.create";

export class CreateAccountCommand {
  public readonly email: string;
  public readonly password: string;
  public readonly name: string;
  public readonly active: boolean = true;

  constructor(createAccountDto: CreateAccountDTO) {
    this.email = createAccountDto.email;
    this.password = createAccountDto.password;
    this.name = createAccountDto.name;
  }
}