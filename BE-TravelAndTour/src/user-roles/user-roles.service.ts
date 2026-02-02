import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRolesService {
    constructor(private prisma: PrismaService) { }

    async assignRole(userId: number, roleId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const role = await this.prisma.role.findUnique({ where: { id: roleId } });
        if (!role) throw new NotFoundException('Role not found');

        const exists = await this.prisma.userRole.findUnique({
            where: {
                userId_roleId: {
                    userId,
                    roleId,
                },
            },
        });

        if (exists) {
            throw new BadRequestException('User already has this role');
        }

        return this.prisma.userRole.create({
            data: { userId, roleId },
        });
    }

    async removeRole(userId: number, roleId: number) {
        const userRole = await this.prisma.userRole.findUnique({
            where: {
                userId_roleId: {
                    userId,
                    roleId,
                },
            },
        });

        if (!userRole) {
            throw new NotFoundException('UserRole not found');
        }

        return this.prisma.userRole.delete({
            where: {
                userId_roleId: {
                    userId,
                    roleId,
                },
            },
        });
    }


    async findRolesByUser(userId: number) {
        return this.prisma.userRole.findMany({
            where: { userId },
            include: { role: true },
        });
    }
}
