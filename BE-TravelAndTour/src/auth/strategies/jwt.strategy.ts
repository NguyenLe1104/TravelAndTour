import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_SECRET,
        });
    }

    async validate(payload: any) {
        return {
<<<<<<< HEAD
=======
            id: payload.sub,
>>>>>>> 6c7558a122fd503fc8b6f42a191a42938ce90414
            sub: payload.sub,
            username: payload.username,
            email: payload.email,
            roles: payload.roles,
        };
    }
}
