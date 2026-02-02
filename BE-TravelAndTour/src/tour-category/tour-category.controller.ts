import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { TourCategoryService } from './tour-category.service';

@Controller('tour-categories')
export class TourCategoryController {
  constructor(private readonly tourCategoryService: TourCategoryService) {}

  @Get() // API: GET /tour-categories?search=...
  async getAll(@Query('search') search?: string) {
    return this.tourCategoryService.findAll(search);
  }

  @Post() // API: POST /tour-categories (Tạo mới)
  async create(@Body() data: { name: string; description?: string }) {
    return this.tourCategoryService.create(data);
  }

  @Patch(':id') // API: PATCH /tour-categories/1 (Sửa)
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.tourCategoryService.update(id, data);
  }

  @Delete(':id') // API: DELETE /tour-categories/1 (Xóa)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.tourCategoryService.remove(id);
  }
}