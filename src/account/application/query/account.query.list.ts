import { ReadAccountListDTO } from "../../interface/dto/account.dto.read.list";

export class ReadAccountListQuery {
  public readonly email: string;
  public readonly password: string;

  constructor(dto: ReadAccountListDTO) {
    this.email = dto.email;
    this.password = dto.password;
  }
}
