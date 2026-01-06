import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async login(usernameOrEmail: string, password: string) {
        const user = await this.usersService.findByUsernameOrEmail(usernameOrEmail);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            roles: user.userRoles.map(ur => ur.role.name),
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
            },
        };
    }

    async validateUser(userId: number) {
        return this.usersService.findOne(userId);
    }
}
