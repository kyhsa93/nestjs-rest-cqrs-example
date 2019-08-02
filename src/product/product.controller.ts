import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product as ProductEntity } from './product.entity';

@Controller('product')
export class ProductController {
  constructor (
    private readonly productService: ProductService
  ) {}

  @Get()
  getProduct(): Promise<ProductEntity[]> {
    return this.productService.findAll();
  }

  @Get(':name')
  getProductByName(@Param() params: any): Promise<ProductEntity> {
    return this.productService.findByName(params.name);
  }

  @Post()
  create(@Body() product: ProductEntity) {
    return this.productService.create(product);
  }

  @Put()
  update(@Body() product: ProductEntity) {
    return this.productService.update(product);
  }

  @Delete(':id')
  remove(@Param() params: any): Promise<number> {
    return this.productService.remove(params.id);
  }
}
