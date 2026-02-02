import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { TourCategoryController } from './tour-category/tour-category.controller';
import { TourCategoryService } from './tour-category/tour-category.service';
import { TourModule } from './tour/tour.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    UsersModule,
    AuthModule,
    RolesModule,
    UserRolesModule,
    TourModule
  ],
  controllers: [AppController, TourCategoryController],
  providers: [AppService, TourCategoryService],
})
export class AppModule { }