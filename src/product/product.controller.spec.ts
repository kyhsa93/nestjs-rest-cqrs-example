import { Test } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product as ProductEntity } from './product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { CreateProductDTO } from './dto/product.dto.create';
import { UpdateProductBodyDTO, UpdateProductParamDTO } from './dto/product.dto.update';
import { DeleteProductDTO } from './dto/product.dto.delete';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  const id = 'testid';
  const name = 'testname';
  const description = 'testdescription';

  const product = new ProductEntity();
  const createProductDto = new CreateProductDTO(name, description)
  const updateProductParamDto = new UpdateProductParamDTO(id);
  const updateProductBodyDto = new UpdateProductBodyDTO(name, description);
  const deleteProductDto = new DeleteProductDTO(id);

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
  
  describe('getProductById', () => {
    it('should be return an object of product', async () => {
      jest.spyOn(productService, 'findById').mockResolvedValue(product);

      expect(await productController.getProductById(product)).toBe(product);
    });
  });

  describe('create', () => {
    it('should be return an object of product', async () => {
      jest.spyOn(productService, 'create').mockResolvedValue(product);

      expect(await productController.create(createProductDto)).toBe(product);
    });
  });

  describe('update', () => {
    it('should be return an object of product', async () => {
      jest.spyOn(productService, 'update').mockResolvedValue(product);

      expect(await productController.update(updateProductParamDto, updateProductBodyDto)).toBe(product);
    });
  });

  describe('remove', () => {
    it('should be return an number of deleted', async () => {
      jest.spyOn(productService, 'remove').mockResolvedValue(product);

      expect(await productController.remove(deleteProductDto)).toBe(product);
    });
  });
});
