import {
    Controller,
    Post,
    Body,
    Get,
    Delete,
    Param,
} from '@nestjs/common';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

import { RolesService } from './roles.service';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) { }

    @Post()
    @ResponseMessage('Created role successfully')
    create(@Body('name') name: string) {
        return this.rolesService.create(name);
    }

    @Get()
    @ResponseMessage('Get roles successfully')

    findAll() {
        return this.rolesService.findAll();
    }

    @Delete(':id')
    @ResponseMessage('Deleted role successfully')
    remove(@Param('id') id: string) {
        return this.rolesService.remove(+id);
    }
}
