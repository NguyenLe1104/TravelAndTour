import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewTourDto } from './dto/create-reviewtour.dto';
import { UpdateReviewTourDto } from './dto/update-reviewtour.dto';

@Injectable()
export class ReviewTourService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateReviewTourDto) {
    // 1️⃣ Check user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    // 2️⃣ Check tour
    const tour = await this.prisma.tour.findUnique({
      where: { id: dto.tourId },
    });
    if (!tour) throw new NotFoundException('Tour not found');

    // 3️⃣ Check đã review chưa
    const existed = await this.prisma.review.findUnique({
      where: {
        userId_tourId: {
          userId,
          tourId: dto.tourId,
        },
      },
    });
    if (existed) {
      throw new BadRequestException('User already reviewed this tour');
    }

    // 4️⃣ Create review
    return this.prisma.review.create({
      data: {
        userId,
        tourId: dto.tourId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  findByTour(tourId: number) {
    return this.prisma.review.findMany({
      where: { tourId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

  async update(id: number, dto: UpdateReviewTourDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.delete({
      where: { id },
    });
  }
}