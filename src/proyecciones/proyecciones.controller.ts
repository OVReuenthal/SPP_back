import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProyeccionesService } from './proyecciones.service';
import { CreateProyeccioneDto } from './dto/create-proyeccione.dto';
import { UpdateProyeccioneDto } from './dto/update-proyeccione.dto';

@Controller('proyecciones')
export class ProyeccionesController {
  constructor(private readonly proyeccionesService: ProyeccionesService) {}

  @Post()
  create(@Body() createProyeccioneDto: CreateProyeccioneDto) {
    return this.proyeccionesService.create(createProyeccioneDto);
  }

  @Get()
  findAll() {
    return this.proyeccionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proyeccionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProyeccioneDto: UpdateProyeccioneDto) {
    return this.proyeccionesService.update(+id, updateProyeccioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proyeccionesService.remove(+id);
  }
}
