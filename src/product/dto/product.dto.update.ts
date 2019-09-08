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
  readonly product_id: string;

  constructor(product_id: string) {
    this.product_id = product_id;
  }
}

export class UpdateProductDTO {
  readonly product_id: string;
  readonly name: string;
  readonly description: string;

  constructor(product_id: string, name: string, description: string) {
    this.product_id = product_id;
    this.name = name;
    this.description = description;
  }
}
