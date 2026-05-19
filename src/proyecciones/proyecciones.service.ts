import { Injectable } from '@nestjs/common';
import { CreateProyeccioneDto } from './dto/create-proyeccione.dto';
import { UpdateProyeccioneDto } from './dto/update-proyeccione.dto';

@Injectable()
export class ProyeccionesService {
  create(createProyeccioneDto: CreateProyeccioneDto) {
    return 'This action adds a new proyeccione';
  }

  findAll() {
    return `This action returns all proyecciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} proyeccione`;
  }

  update(id: number, updateProyeccioneDto: UpdateProyeccioneDto) {
    return `This action updates a #${id} proyeccione`;
  }

  remove(id: number) {
    return `This action removes a #${id} proyeccione`;
  }
}
