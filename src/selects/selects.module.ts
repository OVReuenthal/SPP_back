import { Module } from '@nestjs/common';
import { SelectsService } from './selects.service';
import { SelectsController } from './selects.controller';

@Module({
  controllers: [SelectsController],
  providers: [SelectsService],
})
export class SelectsModule {}
