import { ApiModelProperty } from '@nestjs/swagger';

export class ReadProductDTO {
  @ApiModelProperty()
  readonly productId: string;

  constructor(productId: string) {
    this.productId = productId;
  }
}
