import { Injectable } from '@nestjs/common';
import { CreateProyectoMayorDto } from './dto/createProyectoMayor.dto';
import { UpdateProyectoMayorDto } from './dto/updateProyectoMayor.dto';
import { CreateProyectoMenorDto } from './dto/createProyectoMenor.dto';
import { UpdateProyectoMenorDto } from './dto/updateProyectoMenor.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  ///Proyecto Mayor funciones

  async createProyectoMayor(createProyectoMayorDto: CreateProyectoMayorDto) {
    const sql = `INSERT INTO proyecto_mayor (elemento_pep, nombre, descripcion, presupuesto) VALUES ($1, $2, $3, $4) RETURNING *`;
    return await this.dataSource.query(sql, [
      createProyectoMayorDto.elemento_pep,
      createProyectoMayorDto.nombre,
      createProyectoMayorDto.descripcion,
      createProyectoMayorDto.presupuesto,
    ]);
  }

  async findProyectoMayor() {
    return await this.dataSource.query(`SELECT * FROM proyecto_mayor`);
  }

  async findOneProyectoMayor(elemento_pep: string) {
    return await this.dataSource.query(`SELECT * FROM proyecto_mayor WHERE elemento_pep = $1`, [elemento_pep]);
  }

  async updateProyectoMayor(elemento_pep: string, updateProyectoMayorDto: UpdateProyectoMayorDto) {
    const sql = `UPDATE proyecto_mayor SET nombre = $1, descripcion = $2, presupuesto = $3 WHERE elemento_pep = $4 RETURNING *`;
    return await this.dataSource.query(sql, [
      updateProyectoMayorDto.nombre,
      updateProyectoMayorDto.descripcion,
      updateProyectoMayorDto.presupuesto,
      elemento_pep,
    ]);
  }

    async removeProyectoMayor(elemento_pep: string) {
    return await this.dataSource.query(`DELETE FROM proyecto_mayor WHERE elemento_pep = $1`, [elemento_pep]);
  }

  ///Proyecto Menor funciones
  
  async createProyectoMenor(createProyectoMenorDto: CreateProyectoMenorDto) {
    const sql = `INSERT INTO proyecto_menor (elemento_pep_secundario, grafo, nombre, descripcion, elemento_pep, presupuesto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    return await this.dataSource.query(sql, [
      createProyectoMenorDto.elemento_pep_secundario,
      createProyectoMenorDto.grafo,
      createProyectoMenorDto.nombre,
      createProyectoMenorDto.descripcion,
      createProyectoMenorDto.elemento_pep,
      createProyectoMenorDto.presupuesto,
    ]);
  }

  async findProyectoMenor() {
    return await this.dataSource.query(`SELECT pm.elemento_pep_secundario, pm.nombre, pm.descripcion, pm.presupuesto, pm.grafo, pm.elemento_pep FROM proyecto_menor pm ORDER BY pm.elemento_pep_secundario ASC`);
  }

  async findOneProyectoMenor(elemento_pep_secundario: string) {
    return await this.dataSource.query(`SELECT pm.elemento_pep_secundario, pm.nombre, pm.descripcion, pm.presupuesto, pm.grafo, pm.elemento_pep FROM proyecto_menor pm WHERE pm.elemento_pep_secundario = $1`, [elemento_pep_secundario]);
  }

  async updateProyectoMenor(elemento_pep_secundario: string, updateProyectoMenorDto: UpdateProyectoMenorDto) {
    const sql = `UPDATE proyecto_menor SET elemento_pep_secundario = $1, grafo = $2, nombre = $3, descripcion = $4, elemento_pep = $5, presupuesto = $6 WHERE elemento_pep_secundario = $7 RETURNING *`;
    return await this.dataSource.query(sql, [
      updateProyectoMenorDto.elemento_pep_secundario,
      updateProyectoMenorDto.grafo,
      updateProyectoMenorDto.nombre,
      updateProyectoMenorDto.descripcion,
      updateProyectoMenorDto.elemento_pep,
      updateProyectoMenorDto.presupuesto,
      elemento_pep_secundario,
    ]);
  }

    async removeProyectoMenor(elemento_pep_secundario: string) {
    return await this.dataSource.query(`DELETE FROM proyecto_menor WHERE elemento_pep_secundario = $1`, [elemento_pep_secundario]);
  } 

  async findProyectoMenorByElementoPep(elemento_pep: string) {
    return await this.dataSource.query(`SELECT pm.elemento_pep_secundario, pm.nombre, pm.descripcion, pm.presupuesto, pm.grafo, pm.elemento_pep FROM proyecto_menor pm WHERE pm.elemento_pep = $1`, [elemento_pep]);
  }

  


}
