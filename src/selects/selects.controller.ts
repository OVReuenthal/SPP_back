import { Controller, Get } from '@nestjs/common';
import { SelectsService } from './selects.service';

@Controller('selects')
export class SelectsController {
  constructor(private readonly selectsService: SelectsService) {}

  @Get('clases-costos')
  getClasesCostos() {
    return this.selectsService.getClasesCostos();
  }

  @Get('tipo-presupuesto')
  getTipoPresupuesto() {
    return this.selectsService.getTipoPresupuesto();
  }

  @Get('distribucion')
  getDistribucion() {
    return this.selectsService.getDistribucion();
  }
}
