import { Controller, Delete, Get, Inject, Param, Patch, Body, UseGuards, Req, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { CurrentUser, JwtAuthGuard, Roles, RolesGuard, UserRole } from "utils/src";
import { UserOwnerGuard } from "utils/src/guards/owner.guard";

@Controller('users')
@UseGuards(JwtAuthGuard, UserOwnerGuard, RolesGuard)
export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy) { }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.USER)
    async getAllUsers() {
        return await firstValueFrom(this.userClient.send('findAllUsers', {}));
    }

    @Get('id/:id')
    @Roles(UserRole.ADMIN)
    async getUserById(@Param('id') id: string) {
        return await firstValueFrom(this.userClient.send('findUserById', id));
    }

    @Get('email/:email')
    @Roles(UserRole.ADMIN, UserRole.USER)
    async getUserByEmail(@Param('email') email: string) {
        return await firstValueFrom(this.userClient.send('findUserByEmail', email));
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.USER)
    async updateUser(@Param('id') id: string, @Body() updateUserDto: any, @CurrentUser("id") userId: string) {
        return await firstValueFrom(this.userClient.send('updateUser', {
            id,
            updateUser: updateUserDto,
            user: userId
        }));
    }
    
    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.USER)
    async deleteUser(@Param('id') id: string, @Req() req) {
        this.logger.log("deleteUser - Utilisateur transmis:", req.user);
        return await firstValueFrom(this.userClient.send('removeUser', {
            id,
            user: req.user
        }));
    }
}