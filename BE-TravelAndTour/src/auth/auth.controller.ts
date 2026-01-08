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

    @Post('refresh')
    @ResponseMessage('Token refreshed successfully')
    refresh(@Body() body: { refreshToken: string }) {
        return this.authService.refresh(body.refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ResponseMessage('Logout successfully')
    logout(@Request() req, @Body() body: { refreshToken: string }) {
        return this.authService.logout(req.user.sub, body.refreshToken);
    }

    @Post('logout-all')
    @UseGuards(JwtAuthGuard)
    @ResponseMessage('Logged out from all devices')
    logoutAll(@Request() req) {
        return this.authService.logoutAll(req.user.sub);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ResponseMessage('User profile retrieved successfully')
    getProfile(@Request() req) {
        return {
            userId: req.user.sub,
            username: req.user.username,
            email: req.user.email,
            roles: req.user.roles,
        };
    }
}
