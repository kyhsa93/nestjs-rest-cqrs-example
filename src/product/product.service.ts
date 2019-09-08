import moment from 'moment';
import { v4 as uuid} from 'uuid';
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product as ProductEntity } from './product.entity';
import { ProductRepository } from "./product.repository";
import { CreateProductDTO } from './dto/product.dto.create';
import { UpdateProductDTO } from './dto/product.dto.update';
import { DeleteProductDTO } from './dto/product.dto.delete';
import { ReadProductDTO } from './dto/product.dto.read';
import { IsNull } from 'typeorm';

@Injectable()
export class ProductService {
  constructor (
    @InjectRepository(ProductEntity)
    private readonly productRepository: ProductRepository
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find({ deleted_at: IsNull() });
  }

  async findById(product: ReadProductDTO): Promise<ProductEntity> {
    return this.productRepository.findOneOrFail({ ...product, deleted_at: IsNull() }).catch(() => {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    });
  }

  async create(product: CreateProductDTO): Promise<ProductEntity> {
    const tokens = uuid().split('-');
    const newId = `${tokens[2]}${tokens[1]}${tokens[0]}${tokens[3]}${tokens[4]}`;
    const created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    return this.productRepository.save({ product_id: newId, ...product, created_at });
  }

  async update(product: UpdateProductDTO): Promise<ProductEntity> {
    const data = await this.productRepository.findOneOrFail({ product_id: product.product_id, deleted_at: IsNull() }).catch(() => {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    });
    const updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
    return this.productRepository.save({ ...product, created_at: data.created_at, updated_at });
  }

  async remove(product: DeleteProductDTO): Promise<ProductEntity> {
    const data = await this.productRepository.findOneOrFail({ ...product, deleted_at: IsNull() }).catch(() => {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    });
    const deleted_at = moment().format('YYYY-MM-DD HH:mm:ss');
    return this.productRepository.save({ ...data, deleted_at });
  }
}
