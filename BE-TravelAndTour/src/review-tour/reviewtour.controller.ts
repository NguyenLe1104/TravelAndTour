import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewTourService } from './reviewtour.service';
import { CreateReviewTourDto } from './dto/create-reviewtour.dto';
import { UpdateReviewTourDto } from './dto/update-reviewtour.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviewtour')
export class ReviewTourController {
  constructor(private readonly service: ReviewTourService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() dto: CreateReviewTourDto) {
    // userId lấy từ token
    return this.service.create(req.user.sub, dto);
  }

  @Get('tour/:tourId')
  findByTour(@Param('tourId') tourId: string) {
    return this.service.findByTour(Number(tourId));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateReviewTourDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}