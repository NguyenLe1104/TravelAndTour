import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

@Injectable()
export class ToursService {
    constructor(private prisma: PrismaService) { }

    create(dto: CreateTourDto) {
        return this.prisma.tour.create({
            data: {
                ...dto,
                seatsAvailable: dto.seatsTotal,
                status: 'DRAFT',
            },
        });
    }

    findAll() {
        return this.prisma.tour.findMany({
            where: { status: 'PUBLISHED' },
        });
    }

    findOne(id: number) {
        return this.prisma.tour.findUnique({
            where: { id },
            include: {
                images: true,
                schedules: true,
            },
        });
    }

    update(id: number, dto: UpdateTourDto) {
        return this.prisma.tour.update({
            where: { id },
            data: dto,
        });
    }

    publish(id: number) {
        return this.prisma.tour.update({
            where: { id },
            data: { status: 'PUBLISHED' },
        });
    }

    remove(id: number) {
        return this.prisma.tour.delete({
            where: { id },
        });
    }

    findAllAdmin() {
        return this.prisma.tour.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    close(id: number) {
        return this.prisma.tour.update({
            where: { id },
            data: { status: 'CLOSED' },
        });
    }

    search(query: {
        location?: string;
        minPrice?: number;
        maxPrice?: number;
    }) {
        return this.prisma.tour.findMany({
            where: {
                status: 'PUBLISHED',
                ...(query.location && { location: query.location }),
                ...(query.minPrice || query.maxPrice
                    ? {
                        price: {
                            ...(query.minPrice && { gte: query.minPrice }),
                            ...(query.maxPrice && { lte: query.maxPrice }),
                        },
                    }
                    : {}),
            },
        });
    }


}