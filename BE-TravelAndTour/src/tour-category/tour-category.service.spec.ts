import { Test, TestingModule } from '@nestjs/testing';
import { TourCategoryService } from './tour-category.service';

describe('TourCategoryService', () => {
  let service: TourCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TourCategoryService],
    }).compile();

    service = module.get<TourCategoryService>(TourCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
