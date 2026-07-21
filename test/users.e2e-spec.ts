import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
const cookieParser = require('cookie-parser');
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  const mockUsersService = {
    create: jest.fn((dto) => {
      return {
        id: 1,
        ...dto,
      };
    }),
    login: jest.fn((dto) => {
      if (dto.user_name === 'test_user' && dto.password === 'password123') {
        return { message: 'Login exitoso', user: { user_name: dto.user_name, rol: 'admin' }, token: 'mock-jwt-token' };
      }
      return { message: 'Credenciales inválidas' };
    }),
    verifyToken: jest.fn((token) => {
      if (token === 'mock-jwt-token') {
        return { valid: true, user: { user_name: 'test_user', rol: 'admin' } };
      }
      return { valid: false };
    }),
    logout: jest.fn(() => {
      return { message: 'Logout successful' };
    }),
    findAll: jest.fn(() => {
      return [{ user_name: 'test_user', rol: 'admin' }];
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) - Crear usuario', async () => {
    const newUser = { user_name: 'new_user', password: 'password', rol: 'user' };
    const res = await request(app.getHttpServer())
      .post('/users')
      .send(newUser)
      .expect(201);
    
    expect(res.body).toEqual({
      id: 1,
      ...newUser,
    });
  });

  it('/users (GET) - Obtener usuarios', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .expect(200);
    
    expect(res.body).toEqual([{ user_name: 'test_user', rol: 'admin' }]);
  });

  it('/users/login (POST) - Inicio de sesión', async () => {
    const credentials = { user_name: 'test_user', password: 'password123' };
    const res = await request(app.getHttpServer())
      .post('/users/login')
      .send(credentials)
      .expect(201);

    expect(res.body.message).toBe('Login exitoso');
    expect(res.headers['set-cookie'][0]).toContain('Authentication=mock-jwt-token');
  });

  it('/users/validate (GET) - Validar sesión exitosa', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/validate')
      .set('Cookie', ['Authentication=mock-jwt-token'])
      .expect(200);

    expect(res.body).toEqual({ valid: true, user: { user_name: 'test_user', rol: 'admin' } });
  });

  it('/users/validate (GET) - Validar sesión fallida', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/validate')
      .expect(200);

    expect(res.body).toEqual({ valid: false });
  });

  it('/users/logout (POST) - Cerrar sesión', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/logout')
      .expect(201);

    expect(res.body).toEqual({ message: 'Logout successful' });
    expect(res.headers['set-cookie'][0]).toContain('Authentication=;');
  });
});
