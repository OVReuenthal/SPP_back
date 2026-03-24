import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SalesService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createSale(saleData: CreateSaleDto) {
    const sqlProduct = `SELECT precio FROM productos WHERE id = $1`;
    const productResult = await this.dataSource.query(sqlProduct, [
      saleData.product_id,
    ]);

    if (productResult.length === 0) {
      throw new NotFoundException('Producto no encontrado');
    }

    const precioUnitario = Number(productResult[0].precio);
    const precioTotal = saleData.quantity * precioUnitario;

    const sqlInsert = `
      INSERT INTO public.ventas (producto_id, user_id, cantidad, fecha_venta, precio_total)
      VALUES ($1, $2, $3, NOW(), $4)
      RETURNING *
    `; // <-- Sin punto y coma interno

    const result = await this.dataSource.query(sqlInsert, [
      saleData.product_id,
      saleData.user_id,
      saleData.quantity,
      precioTotal,
    ]);

    return result[0];
  }

  async getAllSales() {
    const sql = `SELECT 
    v.id AS sale_id, 
    u.user_name AS user_name, 
    v.cantidad AS quantity, 
    v.fecha_venta AS date,
    p.nombre AS product,
    v.precio_total AS total_price
    FROM ventas v
    INNER JOIN users u ON v.user_id = u.id
    INNER JOIN productos p ON v.producto_id = p.id;`;
    return await this.dataSource.query(sql);
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
