import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TourService } from './tour.service';
import { Prisma } from '@prisma/client';

@Controller('tours')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  // 1. API Tạo Tour (POST /tours)
  @Post()
  create(@Body() data: any) {
    // Ép kiểu dữ liệu để đảm bảo các số không bị hiểu nhầm là chuỗi
    const tourData: Prisma.TourUncheckedCreateInput = {
      title: data.title,
      description: data.description,
      price: data.price,                // Giá tiền
      durationDays: +data.durationDays, // Dấu + để ép thành số nguyên
      location: data.location,
      seatsTotal: +data.seatsTotal,     // Tổng số ghế
      // Nếu không gửi seatsAvailable thì mặc định bằng seatsTotal
      seatsAvailable: data.seatsAvailable ? +data.seatsAvailable : +data.seatsTotal,
      categoryId: +data.categoryId,     // QUAN TRỌNG: Phải ép về số để liên kết với Category
      
      // Xử lý ngày tháng nếu có gửi lên (tùy chọn)
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    };
    
    return this.tourService.create(tourData);
  }

  // 2. API Lấy danh sách Tour (GET /tours)
  @Get()
  findAll() {
    return this.tourService.findAll();
  }

  // 3. API Lấy chi tiết 1 Tour (GET /tours/1)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tourService.findOne(id);
  }

  // 4. API Cập nhật Tour (PATCH /tours/1)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.tourService.update(id, data);
  }

  // 5. API Xóa Tour (DELETE /tours/1)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tourService.remove(id);
  }
}