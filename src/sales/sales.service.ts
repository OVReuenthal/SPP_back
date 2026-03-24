import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SalesService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createSale(saleData: CreateSaleDto) {
    const date: Date = new Date();
    const sql = `INSERT INTO public.ventas(producto_id, user_id, cantidad, fecha_venta)
	  VALUES ($1, $2, $3, $4);RETURNING *`;
    return await this.dataSource.query(sql, [
      saleData.product_id,
      saleData.user_id,
      saleData.quantity,
      date,
    ]);
  }

  async getAllSales() {
    const sql = `SELECT 
    v.id AS sale_id, 
    u.user_name AS user_name, 
    v.cantidad AS quantity, 
    v.fecha_venta AS date,
    p.nombre AS product
FROM ventas v
INNER JOIN users u ON v.user_id = u.id
INNER JOIN productos p ON v.producto_id = p.id;`;
    return await this.dataSource.query(sql);
  }

  findAll() {
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
