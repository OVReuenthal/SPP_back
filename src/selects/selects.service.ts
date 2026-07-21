import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class SelectsService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getClasesCostos() {
    return await this.dataSource.query(`SELECT * FROM clases_costos`);
  }

  async getTipoPresupuesto() {
    return await this.dataSource.query(`SELECT * FROM tipo_presupuesto`);
  }

  async getDistribucion() {
    return await this.dataSource.query(`SELECT * FROM distribucion`);
  }
  
  async getEstadoActividad() {
    return await this.dataSource.query(`SELECT * FROM estado_actividad`);
  }
}
