import { Test, TestingModule } from '@nestjs/testing';
import { SelectsService } from './selects.service';

describe('SelectsService', () => {
  let service: SelectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SelectsService],
    }).compile();

    service = module.get<SelectsService>(SelectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
