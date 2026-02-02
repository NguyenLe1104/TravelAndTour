import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    // USER ENDPOINTS
    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(req.user.id, createBookingDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Request() req) {
        return this.bookingsService.findAll(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.bookingsService.findOne(id, req.user.id);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
        @Body() updateBookingStatusDto: UpdateBookingStatusDto,
    ) {
        return this.bookingsService.updateStatus(id, req.user.id, updateBookingStatusDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    cancel(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.bookingsService.cancel(id, req.user.id);
    }

    // ADMIN ENDPOINTS
    @Get('admin/tour/:tourId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    getBookingsByTour(@Param('tourId', ParseIntPipe) tourId: number) {
        return this.bookingsService.getBookingsByTour(tourId);
    }

    @Get('admin/stats/:tourId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    getBookingStats(@Param('tourId', ParseIntPipe) tourId: number) {
        return this.bookingsService.getBookingStats(tourId);
    }
}
