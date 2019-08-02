import { EntityRepository, Repository } from 'typeorm';
import { Product as ProductEntity } from './product.entity';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {}
