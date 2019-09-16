import { ApiModelProperty } from "@nestjs/swagger";

export class UpdateProductBodyDTO {
  @ApiModelProperty()
  readonly name: string;

  @ApiModelProperty()
  readonly description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}

export class UpdateProductParamDTO {
  @ApiModelProperty()
  readonly productId: string;

  constructor(productId: string) {
    this.productId = productId;
  }
}

export class UpdateProductDTO {
  readonly productId: string;
  readonly name: string;
  readonly description: string;

  constructor(productId: string, name: string, description: string) {
    this.productId = productId;
    this.name = name;
    this.description = description;
  }
}
