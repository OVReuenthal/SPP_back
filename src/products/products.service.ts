import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ReplenishDto } from './dto/replenish.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createProduct(createProductDto: CreateProductDto) {
    const sql = `INSERT INTO productos (nombre, precio, stock) VALUES ($1, $2, $3) RETURNING *`;
    return await this.dataSource.query(sql, [
      createProductDto.nombre,
      createProductDto.precio,
      createProductDto.stock,
    ]);
  }

  async getAllProducts() {
    const sql = `SELECT * FROM productos`;
    return await this.dataSource.query(sql);
  }

  async replenish(id: number, replenishDto: ReplenishDto) {
    const sql = `UPDATE productos SET stock = stock + $1 WHERE id = $2 RETURNING *`;
    return await this.dataSource.query(sql, [replenishDto.quantity, id]);
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
