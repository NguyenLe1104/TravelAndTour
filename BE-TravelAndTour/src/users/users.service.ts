import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateUserDto) {
        const exists = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: dto.username },
                    { email: dto.email },
                ],
            },
        });

        if (exists) {
            throw new BadRequestException('The username or email already exists.');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        return this.prisma.user.create({
            data: {
                ...dto,
                password: hashedPassword,
            },
        });
    }

    async findByUsernameOrEmail(usernameOrEmail: string) {
        return this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail },
                ],
            },
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }

    findAll() {
        return this.prisma.user.findMany({
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }

    private async getUserOrThrow(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return user;
    }

    async findOne(id: number) {
        await this.getUserOrThrow(id);

        return this.prisma.user.findUnique({
            where: { id },
            include: {
                userRoles: {
                    include: { role: true },
                },
            },
        });
    }
    async update(id: number, dto: UpdateUserDto) {
        await this.getUserOrThrow(id);

        if (dto.username || dto.email) {
            const exists = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        dto.username ? { username: dto.username } : undefined,
                        dto.email ? { email: dto.email } : undefined,
                    ].filter(Boolean),
                    NOT: { id },
                },
            });

            if (exists) {
                throw new BadRequestException('Username or email already exists');
            }
        }

        return this.prisma.user.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id: number) {
        await this.getUserOrThrow(id);

        return this.prisma.user.delete({
            where: { id },
        });
    }

}
