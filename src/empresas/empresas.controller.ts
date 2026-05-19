import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresasService.create(createEmpresaDto);
  }

  @Get()
  findAll() {
    return this.empresasService.findAll();
  }

  @Get(':codigo_proveedor')
  findOne(@Param('codigo_proveedor') codigo_proveedor: string) {
    return this.empresasService.findOne(codigo_proveedor);
  }

  @Patch(':codigo_proveedor')
  update(@Param('codigo_proveedor') codigo_proveedor: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresasService.update(codigo_proveedor, updateEmpresaDto);
  }

  @Delete(':codigo_proveedor')
  remove(@Param('codigo_proveedor') codigo_proveedor: string) {
    return this.empresasService.remove(codigo_proveedor);
  }
}
