import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SelectsController } from '../src/selects/selects.controller';
import { SelectsService } from '../src/selects/selects.service';

describe('SelectsController (e2e)', () => {
  let app: INestApplication;

  const mockSelectsService = {
    getClasesCostos: jest.fn(() => {
      return [{ id_clase: 1, nombre: 'Clase A' }];
    }),
    getTipoPresupuesto: jest.fn(() => {
      return [{ id_tipo: 1, nombre: 'Presupuesto A' }];
    }),
    getDistribucion: jest.fn(() => {
      return [{ id_distribucion: 1, nombre: 'Campana' }];
    }),
    getEstadoActividad: jest.fn(() => {
      return [{ id_estado: 1, nombre: 'Pendiente' }];
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SelectsController],
      providers: [
        {
          provide: SelectsService,
          useValue: mockSelectsService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/selects/clases-costos (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/selects/clases-costos')
      .expect(200);
    
    expect(res.body).toEqual([{ id_clase: 1, nombre: 'Clase A' }]);
  });

  it('/selects/tipo-presupuesto (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/selects/tipo-presupuesto')
      .expect(200);
    
    expect(res.body).toEqual([{ id_tipo: 1, nombre: 'Presupuesto A' }]);
  });

  it('/selects/distribucion (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/selects/distribucion')
      .expect(200);
    
    expect(res.body).toEqual([{ id_distribucion: 1, nombre: 'Campana' }]);
  });

  it('/selects/estado-actividad (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/selects/estado-actividad')
      .expect(200);
    
    expect(res.body).toEqual([{ id_estado: 1, nombre: 'Pendiente' }]);
  });
});
