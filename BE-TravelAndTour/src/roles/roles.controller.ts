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
