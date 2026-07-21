import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ProyectosController } from '../src/proyectos/proyectos.controller';
import { ProyectosService } from '../src/proyectos/proyectos.service';

describe('ProyectosController (e2e)', () => {
  let app: INestApplication;

  const mockProyectosService = {
    createProyectoMayor: jest.fn((dto) => {
      return { ...dto };
    }),
    findProyectoMayor: jest.fn(() => {
      return [{ elemento_pep: 'P-100', nombre: 'Proyecto Alpha' }];
    }),
    findOneProyectoMayor: jest.fn((pep) => {
      return { elemento_pep: pep, nombre: 'Proyecto Alpha' };
    }),
    updateProyectoMayor: jest.fn((pep, dto) => {
      return { elemento_pep: pep, ...dto };
    }),
    removeProyectoMayor: jest.fn((pep) => {
      return { affected: 1 };
    }),
    createProyectoMenor: jest.fn((dto) => {
      return { ...dto };
    }),
    findProyectoMenor: jest.fn(() => {
      return [{ elemento_pep_secundario: 'P-100-1', nombre: 'Sub Alpha' }];
    }),
    findOneProyectoMenor: jest.fn((pepSec) => {
      return { elemento_pep_secundario: pepSec, nombre: 'Sub Alpha' };
    }),
    updateProyectoMenor: jest.fn((pepSec, dto) => {
      return { elemento_pep_secundario: pepSec, ...dto };
    }),
    removeProyectoMenor: jest.fn((pepSec) => {
      return { affected: 1 };
    }),
    findProyectoMenorByElementoPep: jest.fn((pep) => {
      return [{ elemento_pep_secundario: `${pep}-1`, elemento_pep: pep }];
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProyectosController],
      providers: [
        {
          provide: ProyectosService,
          useValue: mockProyectosService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // --- Proyectos Mayores ---
  it('/proyectos (POST) - Crear proyecto mayor', async () => {
    const data = { elemento_pep: 'P-100', nombre: 'Alpha', descripcion: 'Desc', presupuesto: 100000 };
    const res = await request(app.getHttpServer())
      .post('/proyectos')
      .send(data)
      .expect(201);
    
    expect(res.body).toEqual(data);
  });

  it('/proyectos/mayor (GET) - Obtener proyectos mayores', async () => {
    const res = await request(app.getHttpServer())
      .get('/proyectos/mayor')
      .expect(200);
    
    expect(res.body).toEqual([{ elemento_pep: 'P-100', nombre: 'Proyecto Alpha' }]);
  });

  it('/proyectos/mayor/:elemento_pep (GET) - Obtener un proyecto mayor', async () => {
    const res = await request(app.getHttpServer())
      .get('/proyectos/mayor/P-100')
      .expect(200);
    
    expect(res.body).toEqual({ elemento_pep: 'P-100', nombre: 'Proyecto Alpha' });
  });

  it('/proyectos/mayor/:elemento_pep (PATCH) - Actualizar proyecto mayor', async () => {
    const updateData = { nombre: 'Alpha Updated' };
    const res = await request(app.getHttpServer())
      .patch('/proyectos/mayor/P-100')
      .send(updateData)
      .expect(200);

    expect(res.body).toEqual({ elemento_pep: 'P-100', ...updateData });
  });

  it('/proyectos/mayor/:elemento_pep (DELETE) - Eliminar proyecto mayor', async () => {
    const res = await request(app.getHttpServer())
      .delete('/proyectos/mayor/P-100')
      .expect(200);

    expect(res.body).toEqual({ affected: 1 });
  });

  // --- Proyectos Menores ---
  it('/proyectos/menor (POST) - Crear proyecto menor', async () => {
    const data = { elemento_pep_secundario: 'P-100-1', elemento_pep: 'P-100', grafo: 'G1', nombre: 'Sub Alpha', descripcion: 'D', presupuesto: 20000 };
    const res = await request(app.getHttpServer())
      .post('/proyectos/menor')
      .send(data)
      .expect(201);
    
    expect(res.body).toEqual(data);
  });

  it('/proyectos/menor (GET) - Obtener proyectos menores', async () => {
    const res = await request(app.getHttpServer())
      .get('/proyectos/menor')
      .expect(200);
    
    expect(res.body).toEqual([{ elemento_pep_secundario: 'P-100-1', nombre: 'Sub Alpha' }]);
  });

  it('/proyectos/menor/:id (GET) - Obtener un proyecto menor', async () => {
    const res = await request(app.getHttpServer())
      .get('/proyectos/menor/P-100-1')
      .expect(200);
    
    expect(res.body).toEqual({ elemento_pep_secundario: 'P-100-1', nombre: 'Sub Alpha' });
  });

  it('/proyectos/menor/:id (PATCH) - Actualizar proyecto menor', async () => {
    const updateData = { nombre: 'Sub Alpha Updated' };
    const res = await request(app.getHttpServer())
      .patch('/proyectos/menor/P-100-1')
      .send(updateData)
      .expect(200);

    expect(res.body).toEqual({ elemento_pep_secundario: 'P-100-1', ...updateData });
  });

  it('/proyectos/menor/:id (DELETE) - Eliminar proyecto menor', async () => {
    const res = await request(app.getHttpServer())
      .delete('/proyectos/menor/P-100-1')
      .expect(200);

    expect(res.body).toEqual({ affected: 1 });
  });

  it('/proyectos/menor-por-pep/:pep (GET) - Obtener menores por PEP mayor', async () => {
    const res = await request(app.getHttpServer())
      .get('/proyectos/menor-por-pep/P-100')
      .expect(200);
    
    expect(res.body).toEqual([{ elemento_pep_secundario: 'P-100-1', elemento_pep: 'P-100' }]);
  });
});
