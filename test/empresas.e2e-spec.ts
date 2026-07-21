import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { EmpresasController } from '../src/empresas/empresas.controller';
import { EmpresasService } from '../src/empresas/empresas.service';

describe('EmpresasController (e2e)', () => {
  let app: INestApplication;

  const mockEmpresasService = {
    create: jest.fn((dto) => {
      return {
        ...dto,
      };
    }),
    findAll: jest.fn(() => {
      return [{ codigo_proveedor: 'PROV-01', nombre: 'Tech Corp', rif: 'J-123456' }];
    }),
    findOne: jest.fn((codigo) => {
      return { codigo_proveedor: codigo, nombre: 'Tech Corp', rif: 'J-123456' };
    }),
    update: jest.fn((codigo, dto) => {
      return { codigo_proveedor: codigo, ...dto };
    }),
    remove: jest.fn((codigo) => {
      return { affected: 1 };
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EmpresasController],
      providers: [
        {
          provide: EmpresasService,
          useValue: mockEmpresasService,
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

  it('/empresas (POST) - Crear empresa', async () => {
    const newEmpresa = { codigo_proveedor: 'PROV-02', nombre: 'New Corp', rif: 'J-987654' };
    const res = await request(app.getHttpServer())
      .post('/empresas')
      .send(newEmpresa)
      .expect(201);
    
    expect(res.body).toEqual(newEmpresa);
  });

  it('/empresas (GET) - Obtener empresas', async () => {
    const res = await request(app.getHttpServer())
      .get('/empresas')
      .expect(200);
    
    expect(res.body).toEqual([{ codigo_proveedor: 'PROV-01', nombre: 'Tech Corp', rif: 'J-123456' }]);
  });

  it('/empresas/:codigo_proveedor (GET) - Obtener empresa por ID', async () => {
    const res = await request(app.getHttpServer())
      .get('/empresas/PROV-01')
      .expect(200);
    
    expect(res.body).toEqual({ codigo_proveedor: 'PROV-01', nombre: 'Tech Corp', rif: 'J-123456' });
  });

  it('/empresas/:codigo_proveedor (PATCH) - Actualizar empresa', async () => {
    const updateData = { nombre: 'Tech Corp Updated' };
    const res = await request(app.getHttpServer())
      .patch('/empresas/PROV-01')
      .send(updateData)
      .expect(200);

    expect(res.body).toEqual({ codigo_proveedor: 'PROV-01', ...updateData });
  });

  it('/empresas/:codigo_proveedor (DELETE) - Eliminar empresa', async () => {
    const res = await request(app.getHttpServer())
      .delete('/empresas/PROV-01')
      .expect(200);

    expect(res.body).toEqual({ affected: 1 });
  });
});
