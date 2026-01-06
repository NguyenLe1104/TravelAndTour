import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    create(name: string) {
        return this.prisma.role.create({
            data: { name },
        });
    }

    findAll() {
        return this.prisma.role.findMany();
    }

    remove(id: number) {
        return this.prisma.role.delete({ where: { id } });
    }
}
