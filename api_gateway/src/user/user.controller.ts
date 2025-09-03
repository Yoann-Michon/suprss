import { Controller, Delete, Get, Inject, Param, Patch, Body, UseGuards, Req, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { CurrentUser, JwtAuthGuard, Roles, RolesGuard, UserRole } from "utils/src";
import { UserOwnerGuard } from "utils/src/guards/owner.guard";

@Controller('users')
@UseGuards(JwtAuthGuard, UserOwnerGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.USER)
export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy) { }

    @Get()
    async getAllUsers() {
        return await firstValueFrom(this.userClient.send('findAllUsers', {}));
    }

    @Get('id/:id')
    async getUserById(@Param('id') id: string) {
        return await firstValueFrom(this.userClient.send('findUserById', id));
    }

    @Get('email/:email')
    async getUserByEmail(@Param('email') email: string) {
        return await firstValueFrom(this.userClient.send('findUserByEmail', email));
    }
    
    @Delete(":id")
    async deleteUser(@Param("id") id: string, @CurrentUser("id") userId: string) {
        this.logger.log(`Deleting user ${id} by user ${userId}`);
        return await firstValueFrom(this.userClient.send('removeUser', {
            userId: id
        }));
    }

    @Patch('/settings')
    async updateUserSettings(@Body() data:{language?:string,darkmode?:string}, @CurrentUser("id") userId: string) {
        return await firstValueFrom(this.userClient.send('updateSetting', {
            setting: data,
            id: userId
        }));
    }

    @Patch('me')
    async updateMyProfile(
        @Body() updateUserDto: { username?: string; avatarUrl?: string , password?: string , firstVisit?: boolean,email?:string},
        @CurrentUser("id") userId: string
    ) {
        this.logger.log(`User ${userId} updating own profile`);

    const updateUser = {
      ...updateUserDto,
      id:userId,
    };

    return await firstValueFrom(
      this.userClient.send("updateUser", updateUser)
    );
    }
}