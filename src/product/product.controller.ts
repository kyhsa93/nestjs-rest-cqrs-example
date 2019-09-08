import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product as ProductEntity } from './product.entity';
import { ApiUseTags } from '@nestjs/swagger';
import { CreateProductDTO } from './dto/product.dto.create';
import { UpdateProductParamDTO, UpdateProductBodyDTO, UpdateProductDTO } from './dto/product.dto.update';
import { DeleteProductDTO } from './dto/product.dto.delete';
import { ReadProductDTO } from './dto/product.dto.read';

@ApiUseTags('Products')
@Controller('products')
export class ProductController {
  constructor (
    private readonly productService: ProductService
  ) {}

  @Get()
  getProduct(): Promise<ProductEntity[]> {
    return this.productService.findAll();
  }

  @Get(':product_id')
  getProductById(@Param() params: ReadProductDTO): Promise<ProductEntity> {
    return this.productService.findById(params);
  }

  @Post()
  create(@Body() product: CreateProductDTO) {
    return this.productService.create(product);
  }

  @Put(':product_id')
  update(@Param() product_id: UpdateProductParamDTO, @Body() contents: UpdateProductBodyDTO) {
    const product: UpdateProductDTO = { ...product_id, ...contents };
    return this.productService.update(product);
  }

  @Delete(':product_id')
  remove(@Param() params: DeleteProductDTO): Promise<ProductEntity> {
    return this.productService.remove(params);
  }
}
