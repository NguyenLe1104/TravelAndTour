import { Module } from '@nestjs/common';
import { ReviewTourController } from './reviewtour.controller';
import { ReviewTourService } from './reviewtour.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewTourController],
  providers: [ReviewTourService],
})
export class ReviewTourModule {}
