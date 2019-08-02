import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product as ProductEntity } from './product.entity';
import { ProductRepository } from "./product.repository";

@Injectable()
export class ProductService {
  constructor (
    @InjectRepository(ProductEntity)
    private readonly productRepository: ProductRepository
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  async findByName(name: string): Promise<ProductEntity> {
    const result = await this.productRepository.find({ name });
    return result[0];
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    const result = await this.productRepository.save(product);
    return result;
  }

  async update(product: ProductEntity): Promise<ProductEntity> {
    const data = await this.productRepository.findByIds([product.id]);
    if (data.length < 1) return { id: 0, name: 'invalid', description: 'not found' };
    const result = await this.productRepository.save(product);
    return result;
  }

  async remove(id: number): Promise<number> {
    const result = await this.productRepository.delete({ id });
    return result.affected || 0;
  }
}
