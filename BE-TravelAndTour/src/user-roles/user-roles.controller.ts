import {
    Controller,
    Post,
    Delete,
    Get,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('user-roles')
export class UserRolesController {
    constructor(private service: UserRolesService) { }

    @Post(':userId/:roleId')
    @ResponseMessage('Role assigned to user successfully')
    assignRole(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('roleId', ParseIntPipe) roleId: number,
    ) {
        return this.service.assignRole(userId, roleId);
    }

    @Delete(':userId/:roleId')
    @ResponseMessage('Role removed from user successfully')
    removeRole(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('roleId', ParseIntPipe) roleId: number,
    ) {
        return this.service.removeRole(userId, roleId);
    }

    @Get(':userId')
    @ResponseMessage('Get roles from user successfully')
    findRoles(@Param('userId', ParseIntPipe) userId: number) {
        return this.service.findRolesByUser(userId);
    }
}
