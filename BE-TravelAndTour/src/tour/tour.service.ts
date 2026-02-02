import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TourService {
  constructor(private prisma: PrismaService) {}

  // 1. Tạo Tour mới (Quan trọng nhất: phải có categoryId)
  async create(data: Prisma.TourUncheckedCreateInput) {
    // Logic: Số chỗ còn lại mặc định bằng tổng số chỗ nếu không nhập
    if (!data.seatsAvailable) {
      data.seatsAvailable = data.seatsTotal;
    }

    return this.prisma.tour.create({
      data: {
        ...data,
        // Đảm bảo price được lưu đúng định dạng số
        price: data.price, 
      },
    });
  }

  // 2. Lấy danh sách (Kèm thông tin Category cha)
  async findAll() {
    return this.prisma.tour.findMany({
      include: {
        category: true, // Lấy luôn tên danh mục (VD: Tour Hạ Long thuộc "Du lịch biển")
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. Lấy chi tiết 1 Tour
  async findOne(id: number) {
    const tour = await this.prisma.tour.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!tour) throw new NotFoundException(`Không tìm thấy tour số ${id}`);
    return tour;
  }

  // 4. Cập nhật
  async update(id: number, data: Prisma.TourUpdateInput) {
    return this.prisma.tour.update({
      where: { id },
      data,
    });
  }

  // 5. Xóa
  async remove(id: number) {
    return this.prisma.tour.delete({
      where: { id },
    });
  }
}