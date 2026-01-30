import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { ReviewTourModule } from './review-tour/reviewtour.module';
import { ToursModule } from './tours/tours.module';

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
<<<<<<< HEAD
    ReviewTourModule
=======
    ToursModule
>>>>>>> main
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }