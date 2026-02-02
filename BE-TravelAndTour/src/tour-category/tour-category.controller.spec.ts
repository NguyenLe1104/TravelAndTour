import { Test, TestingModule } from '@nestjs/testing';
import { TourCategoryController } from './tour-category.controller';

describe('TourCategoryController', () => {
  let controller: TourCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TourCategoryController],
    }).compile();

    controller = module.get<TourCategoryController>(TourCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
