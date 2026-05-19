import { Test, TestingModule } from '@nestjs/testing';
import { ProyeccionesController } from './proyecciones.controller';
import { ProyeccionesService } from './proyecciones.service';

describe('ProyeccionesController', () => {
  let controller: ProyeccionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProyeccionesController],
      providers: [ProyeccionesService],
    }).compile();

    controller = module.get<ProyeccionesController>(ProyeccionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
