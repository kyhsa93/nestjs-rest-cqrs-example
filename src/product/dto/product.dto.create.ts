import { ApiModelProperty } from '@nestjs/swagger';

export class CreateProductDTO {
  @ApiModelProperty()
  private readonly name: string;

  @ApiModelProperty()
  private readonly description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
