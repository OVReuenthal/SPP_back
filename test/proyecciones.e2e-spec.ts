import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ProyeccionesController } from '../src/proyecciones/proyecciones.controller';
import { ProyeccionesService } from '../src/proyecciones/proyecciones.service';

describe('ProyeccionesController (e2e)', () => {
  let app: INestApplication;

  const mockProyeccionesService = {
    createActividad: jest.fn((dto) => {
      return { id_actividad: 1, ...dto };
    }),
    createProyeccion: jest.fn((dto) => {
      return { id_proyeccion: 1, ...dto };
    }),
    generarMesesProyeccion: jest.fn((id) => {
      return [{ mes: '2026-06', monto: 1000 }];
    }),
    distribuirEnCampana: jest.fn((monto, duracion, mesInicio) => {
      return [1000, 2000, 4000, 2000, 1000];
    }),
    obtenerActividadesConDetalles: jest.fn(() => {
      return [{ id_actividad: 1, nombre: 'Actividad con detalle' }];
    }),
    findAll: jest.fn(() => {
      return [{ id_actividad: 1, nombre: 'Actividad 1' }];
    }),
    findByEmpresa: jest.fn((codigo) => {
      return [{ id_actividad: 1, codigo_proveedor: codigo }];
    }),
    findByElementoPepSecundario: jest.fn((pep) => {
      return [{ id_actividad: 1, elemento_pep_secundario: pep }];
    }),
    findByEstado: jest.fn((id) => {
      return [{ id_actividad: 1, id_estado: id }];
    }),
    findByClase: jest.fn((id) => {
      return [{ id_actividad: 1, id_clase: id }];
    }),
    findByTipo: jest.fn((id) => {
      return [{ id_actividad: 1, id_tipo: id }];
    }),
    findOne: jest.fn((id) => {
      return { id_actividad: id, nombre: 'Actividad 1' };
    }),
    update: jest.fn((id, dto) => {
      return { id_actividad: id, ...dto };
    }),
    remove: jest.fn((id) => {
      return { affected: 1 };
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProyeccionesController],
      providers: [
        {
          provide: ProyeccionesService,
          useValue: mockProyeccionesService,
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

  it('/proyecciones/actividad (POST) - Crear actividad', async () => {
    const data = { nombre: 'A1', elemento_pep_secundario: 'P-1', codigo_proveedor: 'PR-1', id_estado: 1, id_clase: 1, id_tipo: 1 };
    const res = await request(app.getHttpServer())
      .post('/proyecciones/actividad')
      .send(data)
      .expect(201);
    
    expect(res.body.nombre).toEqual('A1');
  });

  it('/proyecciones/proyeccion (POST) - Crear proyección', async () => {
    const data = { id_actividad: 1, id_distribucion: 1, mes_inicio: '2026-06', monto: 10000, duracion: 5 };
    const res = await request(app.getHttpServer())
      .post('/proyecciones/proyeccion')
      .send(data)
      .expect(201);
    
    expect(res.body.monto).toEqual(10000);
  });

  it('/proyecciones/:id_actividad/generar-meses (POST) - Generar meses', async () => {
    const res = await request(app.getHttpServer())
      .post('/proyecciones/1/generar-meses')
      .expect(201);
    
    expect(res.body).toEqual([{ mes: '2026-06', monto: 1000 }]);
  });

  it('/proyecciones/distribucion/campana (GET) - Distribucion campana', async () => {
    const res = await request(app.getHttpServer())
      .get('/proyecciones/distribucion/campana?monto=10000&duracion=5&mesInicio=1')
      .expect(200);
    
    expect(res.body).toEqual([1000, 2000, 4000, 2000, 1000]);
  });

  it('/proyecciones/detalles (GET) - Obtener actividades con detalles', async () => {
    const res = await request(app.getHttpServer())
      .get('/proyecciones/detalles')
      .expect(200);
    
    expect(res.body[0].nombre).toEqual('Actividad con detalle');
  });

  it('/proyecciones (GET) - Obtener proyecciones', async () => {
    const res = await request(app.getHttpServer())
      .get('/proyecciones')
      .expect(200);
    
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/proyecciones/empresa/:codigo_proveedor (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/proyecciones/empresa/PR-1')
      .expect(200);
    
    expect(res.body[0].codigo_proveedor).toEqual('PR-1');
  });

  it('/proyecciones/estado/:id_estado (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/proyecciones/estado/1')
      .expect(200);
    
    expect(res.body[0].id_estado).toEqual(1);
  });

  it('/proyecciones/:id_actividad (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/proyecciones/1')
      .expect(200);
    
    expect(res.body.id_actividad).toEqual(1);
  });

  it('/proyecciones/:id_actividad (PATCH)', async () => {
    const res = await request(app.getHttpServer())
      .patch('/proyecciones/1')
      .send({ nombre: 'Updated' })
      .expect(200);
    
    expect(res.body.nombre).toEqual('Updated');
  });

  it('/proyecciones/:id_actividad (DELETE)', async () => {
    const res = await request(app.getHttpServer())
      .delete('/proyecciones/1')
      .expect(200);
    
    expect(res.body.affected).toEqual(1);
  });
});
