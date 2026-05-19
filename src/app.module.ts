import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProyeccionesService } from './proyecciones/proyecciones.service';
import { ProyectosService } from './proyectos/proyectos.service';
import { ProyectosModule } from './proyectos/proyectos.module';
import { EmpresasModule } from './empresas/empresas.module';
import { SelectsModule } from './selects/selects.module';
import { ProyeccionesModule } from './proyecciones/proyecciones.module';
import { ProyectosModule } from './proyectos/proyectos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true, // Set to false in production
      logging: true,
    }),
    UsersModule,
    ProyectosModule,
    ProyeccionesModule,
    SelectsModule,
    EmpresasModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProyeccionesService, ProyectosService],
})
export class AppModule {}
