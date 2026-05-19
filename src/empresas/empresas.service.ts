import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto) {
    const sql = `INSERT INTO empresas (codigo_proveedor, rif, nombre) VALUES ($1, $2, $3) RETURNING *`;
    return await this.dataSource.query(sql, [
      createEmpresaDto.codigo_proveedor,
      createEmpresaDto.rif,
      createEmpresaDto.nombre,
    ]);
  }

  async findAll() {
    return await this.dataSource.query(`SELECT * FROM empresas`);
  }

  async findOne(codigo_proveedor: string) {
    return await this.dataSource.query(`SELECT * FROM empresas WHERE codigo_proveedor = $1`, [codigo_proveedor]);
  }

  async update(codigo_proveedor: string, updateEmpresaDto: UpdateEmpresaDto) {
    const sql = `UPDATE empresas SET rif = $1, nombre = $2 WHERE codigo_proveedor = $3 RETURNING *`;
    return await this.dataSource.query(sql, [
      updateEmpresaDto.rif,
      updateEmpresaDto.nombre,
      codigo_proveedor,
    ]);
  }

  async remove(codigo_proveedor: string) {
    return await this.dataSource.query(`DELETE FROM empresas WHERE codigo_proveedor = $1`, [codigo_proveedor]);
  }
}
