import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    /**
     * Login - xác thực user và tạo access token + refresh token
     */
    async login(usernameOrEmail: string, password: string) {
        const user = await this.usersService.findByUsernameOrEmail(usernameOrEmail);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { accessToken, refreshToken, expiresAt } = await this.generateTokens(user.id);

        // Lưu refresh token vào database
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(expiresAt),
            },
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: user.userRoles.map(ur => ur.role.name),
            },
        };
    }

    /**
     * Refresh - tạo access token mới từ refresh token
     */
    async refresh(refreshToken: string) {
        try {
            // Validate refresh token
            const decoded = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const userId = decoded.sub;

            // Kiểm tra refresh token có trong DB không
            const storedToken = await this.prisma.refreshToken.findUnique({
                where: { token: refreshToken },
            });

            if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
                throw new UnauthorizedException('Invalid or expired refresh token');
            }

            const user = await this.usersService.findOne(userId);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const { accessToken, refreshToken: newRefreshToken, expiresAt } = await this.generateTokens(userId);

            // Optional: Xóa refresh token cũ và tạo cái mới (rotation)
            await this.prisma.refreshToken.delete({
                where: { id: storedToken.id },
            });

            await this.prisma.refreshToken.create({
                data: {
                    token: newRefreshToken,
                    userId,
                    expiresAt: new Date(expiresAt),
                },
            });

            return {
                accessToken,
                refreshToken: newRefreshToken,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: user.userRoles.map(ur => ur.role.name),
                },
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    /**
     * Logout - revoke refresh token
     */
    async logout(userId: number, refreshToken: string) {
        try {
            const token = await this.prisma.refreshToken.findUnique({
                where: { token: refreshToken },
            });

            if (!token || token.userId !== userId) {
                throw new BadRequestException('Invalid token');
            }

            await this.prisma.refreshToken.update({
                where: { id: token.id },
                data: { revoked: true },
            });

            return { message: 'Logged out successfully' };
        } catch (error) {
            throw new BadRequestException('Logout failed');
        }
    }

    /**
     * Logout all devices - revoke tất cả refresh token của user
     */
    async logoutAll(userId: number) {
        await this.prisma.refreshToken.updateMany({
            where: { userId },
            data: { revoked: true },
        });

        return { message: 'Logged out from all devices' };
    }

    /**
     * Generate tokens - tạo access token và refresh token
     */
    private async generateTokens(userId: number) {
        const user = await this.usersService.findOne(userId);

        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            roles: user.userRoles.map(ur => ur.role.name),
        };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        } as any);

        const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
        const refreshToken = await this.jwtService.signAsync(
            { sub: userId },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: refreshExpiresIn,
            } as any,
        );

        // Decode refresh token để lấy exp claim
        const decoded: any = this.jwtService.decode(refreshToken);
        const expiresAt = decoded.exp * 1000; // Convert seconds to milliseconds

        return { accessToken, refreshToken, expiresAt };
    }

    /**
     * Parse expiration time string (e.g., "7d", "30m", "3600") to milliseconds
     */
    private parseExpiration(expiresIn: string): number {
        const match = expiresIn.match(/^(\d+)([smhd])$/);
        if (!match) {
            // Giả sử là seconds nếu chỉ là số
            return parseInt(expiresIn) * 1000;
        }

        const value = parseInt(match[1]);
        const unit = match[2];

        switch (unit) {
            case 's':
                return value * 1000;
            case 'm':
                return value * 60 * 1000;
            case 'h':
                return value * 60 * 60 * 1000;
            case 'd':
                return value * 24 * 60 * 60 * 1000;
            default:
                return 7 * 24 * 60 * 60 * 1000; // Default 7 days
        }
    }

    /**
     * Validate user từ JWT payload
     */
    async validateUser(userId: number) {
        return this.usersService.findOne(userId);
    }
}
