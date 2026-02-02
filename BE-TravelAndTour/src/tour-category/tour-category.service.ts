import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TourCategoryService {
  constructor(private prisma: PrismaService) {}

  // 1. Lấy danh sách (Có tìm kiếm + Kèm theo các Tour con)
  async findAll(search?: string) {
    return this.prisma.tourCategory.findMany({
      where: search ? {
        name: { contains: search, mode: 'insensitive' } // Tìm không phân biệt hoa/thường
      } : {},
      include: {
        tours: true, // Lấy luôn danh sách các tour thuộc loại này
      },
      orderBy: { createdAt: 'desc' } // Cái nào mới tạo thì lên đầu
    });
  }

  // 2. Tạo mới
  async create(data: { name: string; description?: string }) {
    return this.prisma.tourCategory.create({ data });
  }

  // 3. Cập nhật
  async update(id: number, data: any) {
    return this.prisma.tourCategory.update({
      where: { id },
      data,
    });
  }

  // 4. Xóa
  async remove(id: number) {
    return this.prisma.tourCategory.delete({
      where: { id },
    });
  }
}