import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, dto: CreateBookingDto) {
        // Validate tour exists and is published
        const tour = await this.prisma.tour.findUnique({
            where: { id: dto.tourId },
        });

        if (!tour) {
            throw new NotFoundException('Tour not found');
        }

        if (tour.status !== 'PUBLISHED') {
            throw new BadRequestException('Tour is not available for booking');
        }

        // Check available seats
        if (tour.seatsAvailable < dto.quantity) {
            throw new BadRequestException(
                `Not enough available seats. Available: ${tour.seatsAvailable}, Requested: ${dto.quantity}`,
            );
        }

        // Validate travelers count matches quantity
        if (dto.travelers.length !== dto.quantity) {
            throw new BadRequestException(
                `Number of travelers must match quantity. Expected: ${dto.quantity}, Got: ${dto.travelers.length}`,
            );
        }

        // Calculate total price
        const totalPrice = tour.price.mul(dto.quantity);

        // Create booking with travelers in transaction
        const booking = await this.prisma.$transaction(async (tx) => {
            // Transform travelers data - convert dob string to DateTime
            const travelers = dto.travelers.map(traveler => ({
                ...traveler,
                dob: traveler.dob ? new Date(traveler.dob) : null,
            }));

            // Create booking
            const createdBooking = await tx.booking.create({
                data: {
                    user: {
                        connect: { id: userId },
                    },
                    tour: {
                        connect: { id: dto.tourId },
                    },
                    quantity: dto.quantity,
                    totalPrice,
                    status: 'PENDING',
                    travelers: {
                        create: travelers,
                    },
                },
                include: {
                    travelers: true,
                    tour: true,
                    user: true,
                },
            });

            // Update tour seatsAvailable
            await tx.tour.update({
                where: { id: dto.tourId },
                data: {
                    seatsAvailable: tour.seatsAvailable - dto.quantity,
                },
            });

            return createdBooking;
        });

        return booking;
    }

    async findAll(userId: number) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: {
                travelers: true,
                tour: true,
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number, userId: number) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                travelers: true,
                tour: true,
                payment: true,
                user: true,
            },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Check if user owns this booking
        if (booking.userId !== userId) {
            throw new BadRequestException('Unauthorized');
        }

        return booking;
    }

    async updateStatus(id: number, userId: number, dto: UpdateBookingStatusDto) {
        const booking = await this.findOne(id, userId);

        // Handle cancellation
        if (dto.status === 'CANCELLED' && booking.status !== 'CANCELLED') {
            // Restore seats
            await this.prisma.$transaction(async (tx) => {
                await tx.booking.update({
                    where: { id },
                    data: { status: 'CANCELLED' },
                });

                await tx.tour.update({
                    where: { id: booking.tourId },
                    data: {
                        seatsAvailable: {
                            increment: booking.quantity,
                        },
                    },
                });
            });

            return this.findOne(id, userId);
        }

        return this.prisma.booking.update({
            where: { id },
            data: { status: dto.status },
            include: {
                travelers: true,
                tour: true,
                payment: true,
            },
        });
    }

    async cancel(id: number, userId: number) {
        const booking = await this.findOne(id, userId);

        if (booking.status === 'COMPLETED') {
            throw new BadRequestException('Cannot cancel completed booking');
        }

        if (booking.status === 'CANCELLED') {
            throw new BadRequestException('Booking already cancelled');
        }

        // Restore seats and cancel booking
        await this.prisma.$transaction(async (tx) => {
            await tx.booking.update({
                where: { id },
                data: { status: 'CANCELLED' },
            });

            await tx.tour.update({
                where: { id: booking.tourId },
                data: {
                    seatsAvailable: {
                        increment: booking.quantity,
                    },
                },
            });
        });

        return this.findOne(id, userId);
    }

    async getBookingsByTour(tourId: number) {
        return this.prisma.booking.findMany({
            where: { tourId },
            include: {
                travelers: true,
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                    },
                },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getBookingStats(tourId: number) {
        const bookings = await this.prisma.booking.findMany({
            where: { tourId },
        });

        const totalBookings = bookings.length;
        const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length;
        const paidBookings = bookings.filter((b) => b.status === 'PAID').length;
        const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED').length;
        const totalRevenue = bookings
            .filter((b) => b.status === 'PAID' || b.status === 'COMPLETED')
            .reduce((sum, b) => sum.add(b.totalPrice), new Decimal(0));

        return {
            totalBookings,
            completedBookings,
            paidBookings,
            cancelledBookings,
            totalRevenue,
        };
    }
}

import { Decimal } from '@prisma/client/runtime/library';
