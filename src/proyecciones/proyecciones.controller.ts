import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProyeccionesService } from './proyecciones.service';
import { CreateProyeccioneDto } from './dto/create-proyeccione.dto';
import { CreateProyeccionDto } from './dto/create-proyeccion.dto';
import { UpdateProyeccioneDto } from './dto/update-proyeccione.dto';

@Controller('proyecciones')
export class ProyeccionesController {
  constructor(private readonly proyeccionesService: ProyeccionesService) {}

  @Post('actividad')
  createActividad(@Body() createProyeccioneDto: CreateProyeccioneDto) {
    return this.proyeccionesService.createActividad(createProyeccioneDto);
  }

  @Post('proyeccion')
  createProyeccion(@Body() createProyeccionDto: CreateProyeccionDto) {
    return this.proyeccionesService.createProyeccion(createProyeccionDto);
  }

  @Post(':id_actividad/generar-meses')
  generarMesesProyeccion(@Param('id_actividad') id_actividad: string) {
    return this.proyeccionesService.generarMesesProyeccion( +id_actividad);
  }

  @Get('distribucion/campana')
  distribuirEnCampana(
    @Query('monto') monto: string,
    @Query('duracion') duracion: string,
    @Query('mesInicio') mesInicio: string,
  ) {
    const numMonto = parseFloat(monto);
    const numDuracion = parseInt(duracion, 10);
    const numMesInicio = parseInt(mesInicio, 10);

    const result = this.proyeccionesService.distribuirEnCampana(numMonto, numDuracion, numMesInicio);
    console.log('Resultado de distribucion en campana:', result);
    return result;
  }

  @Get('detalles')
  obtenerActividadesConDetalles() {
    return this.proyeccionesService.obtenerActividadesConDetalles();
  }

  @Get()
  findAll() {
    return this.proyeccionesService.findAll();
  }

  @Get('empresa/:codigo_proveedor')
  findByEmpresa(@Param('codigo_proveedor') codigo_proveedor: string) {
    return this.proyeccionesService.findByEmpresa(codigo_proveedor);
  }

  @Get('elemento/:elemento_pep_secundario')
  findByElementoPepSecundario(@Param('elemento_pep_secundario') elemento_pep_secundario: string) {
    return this.proyeccionesService.findByElementoPepSecundario(elemento_pep_secundario);
  }

  @Get('estado/:id_estado')
  findByEstado(@Param('id_estado') id_estado: string) {
    return this.proyeccionesService.findByEstado(+id_estado);
  }

  @Get('clase/:id_clase')
  findByClase(@Param('id_clase') id_clase: string) {
    return this.proyeccionesService.findByClase(+id_clase);
  }

  @Get('tipo/:id_tipo')
  findByTipo(@Param('id_tipo') id_tipo: string) {
    return this.proyeccionesService.findByTipo(+id_tipo);
  }

  @Get(':id_actividad')
  findOne(@Param('id_actividad') id_actividad: string) {
    return this.proyeccionesService.findOne(+id_actividad);
  }

  @Patch(':id_actividad')
  update(@Param('id_actividad') id_actividad: string, @Body() updateProyeccioneDto: UpdateProyeccioneDto) {
    return this.proyeccionesService.update(+id_actividad, updateProyeccioneDto);
  }

  @Delete(':id_actividad')
  remove(@Param('id_actividad') id_actividad: string) {
    return this.proyeccionesService.remove(+id_actividad);
  }
}
