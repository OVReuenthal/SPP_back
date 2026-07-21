import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoMayorDto } from './dto/createProyectoMayor.dto';
import { UpdateProyectoMayorDto } from './dto/updateProyectoMayor.dto';
import { CreateProyectoMenorDto } from './dto/createProyectoMenor.dto';
import { UpdateProyectoMenorDto } from './dto/updateProyectoMenor.dto';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Post()
  createProyectoMayor(@Body() createProyectoMayorDto: CreateProyectoMayorDto) {
    return this.proyectosService.createProyectoMayor(createProyectoMayorDto);
  }

  @Get('mayor')
  findProyectoMayor() {
    return this.proyectosService.findProyectoMayor();
  }

  @Get('mayor/:elemento_pep')
  findOneProyectoMayor(@Param('elemento_pep') elemento_pep: string) {
    return this.proyectosService.findOneProyectoMayor(elemento_pep);
  }

  @Patch('mayor/:elemento_pep')
  updateProyectoMayor(@Param('elemento_pep') elemento_pep: string, @Body() updateProyectoMayorDto: UpdateProyectoMayorDto) {
    return this.proyectosService.updateProyectoMayor(elemento_pep, updateProyectoMayorDto);
  }

  @Delete('mayor/:elemento_pep')
  removeProyectoMayor(@Param('elemento_pep') elemento_pep: string) {
    return this.proyectosService.removeProyectoMayor(elemento_pep);
  }

  @Post('menor')
  createProyectoMenor(@Body() createProyectoMenorDto: CreateProyectoMenorDto) {
    return this.proyectosService.createProyectoMenor(createProyectoMenorDto);
  }

  @Get('menor')
  findProyectoMenor() {
    return this.proyectosService.findProyectoMenor();
  }

  @Get('menor/:elemento_pep_secundario')
  findOneProyectoMenor(@Param('elemento_pep_secundario') elemento_pep_secundario: string) {
    return this.proyectosService.findOneProyectoMenor(elemento_pep_secundario);
  }

  @Patch('menor/:elemento_pep_secundario')
  updateProyectoMenor(@Param('elemento_pep_secundario') elemento_pep_secundario: string, @Body() updateProyectoMenorDto: UpdateProyectoMenorDto) {
    return this.proyectosService.updateProyectoMenor(elemento_pep_secundario, updateProyectoMenorDto);
  }

  @Delete('menor/:elemento_pep_secundario')
  removeProyectoMenor(@Param('elemento_pep_secundario') elemento_pep_secundario: string) {
    return this.proyectosService.removeProyectoMenor(elemento_pep_secundario);
  }

  @Get('menor-por-pep/:elemento_pep')
  findProyectoMenorByElementoPep(@Param('elemento_pep') elemento_pep: string) {
    return this.proyectosService.findProyectoMenorByElementoPep(elemento_pep);
  }

}
