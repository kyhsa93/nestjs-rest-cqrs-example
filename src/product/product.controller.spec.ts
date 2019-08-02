import { Test } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product as ProductEntity } from './product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';

describe('ProductController', () => {
  let productController: ProductController;
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
          useValue: ProductRepository
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productController = module.get<ProductController>(ProductController);
  });

  describe('getProduct', () => {
    it('should be return an array of product', async () => {
      jest.spyOn(productService, 'findAll').mockResolvedValue([product]);

      expect(await productController.getProduct()).toStrictEqual([product]);
    });
  });
  
  describe('getProductByName', () => {
    it('should be return an object of product', async () => {
      jest.spyOn(productService, 'findByName').mockResolvedValue(product);

      expect(await productController.getProductByName('test')).toBe(product);
    });
  });

  describe('create', () => {
    it('should be return an object of product', async () => {
      jest.spyOn(productService, 'create').mockResolvedValue(product);

      expect(await productController.create(product)).toBe(product);
    });
  });

  describe('update', () => {
    it('should be return an object of product', async () => {
      jest.spyOn(productService, 'update').mockResolvedValue(product);

      expect(await productController.update(product)).toBe(product);
    });
  });

  describe('remove', () => {
    it('should be return an number of deleted', async () => {
      const id = 1;
      const result = 1;
      jest.spyOn(productService, 'remove').mockResolvedValue(result);

      expect(await productController.remove(id)).toBe(result);
    });
  });
});
