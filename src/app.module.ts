import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalesController } from './sales/sales.controller';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [SalesModule],
  controllers: [AppController, SalesController],
  providers: [AppService],
})
export class AppModule {}
