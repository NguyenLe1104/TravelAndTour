import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ResponseMessage('Login successfully')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto.usernameOrEmail, dto.password);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ResponseMessage('User profile retrieved successfully')
    getProfile(@Request() req) {
        return {
            userId: req.user.userId,
            username: req.user.username,
        };
    }
}
