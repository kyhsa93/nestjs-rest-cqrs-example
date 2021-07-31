import { CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity()
export class BaseEntity {
  @CreateDateColumn()
  createdAt: Date = new Date();

  @UpdateDateColumn()
  updatedAt: Date = new Date();

  @DeleteDateColumn()
  deletedAt: Date | null = null;

  @VersionColumn()
  version: number = 0;
}
