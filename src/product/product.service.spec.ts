import { Test } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product as ProductEntity } from './product.entity';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let productRepository: Repository<ProductEntity>;
  let productService: ProductService;

  const product = {
    id: 1,
    name: 'test',
    description: 'test description',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
  });

  describe('findAll', () => {
    it('should be return an array of product', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue([product]);

      expect(await productService.findAll()).toStrictEqual([product]);
    });
  });

  describe('findByName', () => {
    it('should be return an product', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue([product]);

      expect(await productService.findByName('test')).toBe(product);
    });
  });

  describe('create', () => {
    it('should be return an product', async () => {
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);

      expect(await productService.create(product)).toBe(product);
    });
  });

  describe('update', () => {
    it('should be return an product', async () => {
      jest.spyOn(productRepository, 'findByIds').mockResolvedValue([product]);
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);

      expect(await productService.update(product)).toBe(product);
    });
  });

  describe('remove', () => {
    it('should be return number of affected', async () => {
      jest.spyOn(productRepository, 'delete').mockResolvedValue({ affected: 0, raw: {} });

      expect(await productService.remove(1)).toBe(0);
    });
  });
});
