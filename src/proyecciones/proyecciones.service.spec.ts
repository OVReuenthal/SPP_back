import { Test, TestingModule } from '@nestjs/testing';
import { ProyeccionesService } from './proyecciones.service';

describe('ProyeccionesService', () => {
  let service: ProyeccionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProyeccionesService],
    }).compile();

    service = module.get<ProyeccionesService>(ProyeccionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
