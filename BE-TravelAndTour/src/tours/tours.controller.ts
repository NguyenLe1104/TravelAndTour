import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ToursService } from './tours.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateTourDto } from './dto/create-tour.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateTourDto } from './dto/update-tour.dto';

@Controller('tours')
export class ToursController {
    constructor(private readonly toursService: ToursService) { }

    //USER
    @Get()
    findAll() {
        return this.toursService.findAll();
    }


    @Get('search')
    search(
        @Query('location') location?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
    ) {
        return this.toursService.search({
            location,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
        });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.toursService.findOne(id);
    }



    // ADMIN
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    create(@Body() dto: CreateTourDto) {
        return this.toursService.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTourDto,
    ) {
        return this.toursService.update(id, dto);
    }

    @Patch(':id/publish')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    publish(@Param('id', ParseIntPipe) id: number) {
        return this.toursService.publish(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.toursService.remove(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('admin')
    findAllAdmin() {
        return this.toursService.findAllAdmin();
    }

    @Patch(':id/close')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    close(@Param('id', ParseIntPipe) id: number) {
        return this.toursService.close(id);
    }
}
