import ReadAccountDTO from "../../../interface/dto/account.dto.read";

export class ReadAccountQuery {
  public readonly id: string;

  constructor(dto: ReadAccountDTO) {
    this.id = dto.id;
  }
}
