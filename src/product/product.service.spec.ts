import { Test } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product as ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { ReadProductDTO } from './dto/product.dto.read';
import { CreateProductDTO } from './dto/product.dto.create';
import { DeleteProductDTO } from './dto/product.dto.delete';

describe('ProductService', () => {
  let productRepository: Repository<ProductEntity>;
  let productService: ProductService;

  const id = 'testid';
  const name = 'testname';
  const description = 'testdescription';

  const product = new ProductEntity();
  const readProductDto = new ReadProductDTO(id);
  const createProductDto = new CreateProductDTO(name, description);
  const deleteProductDto = new DeleteProductDTO(id);

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

  describe('findById', () => {
    it('should be return an product', async () => {
      jest.spyOn(productRepository, 'findOneOrFail').mockResolvedValue(product);

      expect(await productService.findById(readProductDto)).toBe(product);
    });
  });

  describe('create', () => {
    it('should be return an product', async () => {
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);

      expect(await productService.create(createProductDto)).toBe(product);
    });
  });

  describe('update', () => {
    it('should be return an product', async () => {
      jest.spyOn(productRepository, 'findOneOrFail').mockResolvedValue(product);
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);

      expect(await productService.update(product)).toBe(product);
    });
  });

  describe('remove', () => {
    it('should be return affected', async () => {
      jest.spyOn(productRepository, 'findOneOrFail').mockResolvedValue(product);
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);

      expect(await productService.remove(deleteProductDto)).toBe(product);
    });
  });
});
