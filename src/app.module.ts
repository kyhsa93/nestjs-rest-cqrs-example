import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductModule } from "./product/product.module";
import { AppController } from "./app.controller";
import { Product as ProductEntity } from "./product/product.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      database: 'nest',
      username: 'root',
      password: 'test',
      synchronize: true,
      logging: true,
      entities: [
        ProductEntity,
      ],
    }),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class ApplicationModule {}
