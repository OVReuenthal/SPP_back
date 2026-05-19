import { Test, TestingModule } from '@nestjs/testing';
import { SelectsController } from './selects.controller';
import { SelectsService } from './selects.service';

describe('SelectsController', () => {
  let controller: SelectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SelectsController],
      providers: [SelectsService],
    }).compile();

    controller = module.get<SelectsController>(SelectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
