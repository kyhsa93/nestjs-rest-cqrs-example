import { ApiModelProperty } from "@nestjs/swagger";

export class DeleteProductDTO {
  @ApiModelProperty()
  readonly productId: string;

  constructor(productId: string) {
    this.productId = productId;
  }
}