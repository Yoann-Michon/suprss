import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Controller, HttpCode, HttpStatus, } from '@nestjs/common';
import { UserRole } from '@guards/roles_guard/role.enum';
import { UpdateSettingInput } from './dto/update-setting.input';
import { log } from 'console';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @MessagePattern('createUser')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Payload() createUserInput: CreateUserInput): Promise<User> {
    try {
      const user = await this.userService.create(createUserInput);
      return user;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating user',
        details: error.message,
      });
    }
  }

  @MessagePattern('findAllUsers')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving users',
        details: error.message,
      });

    }
  }

  @MessagePattern('findUserById')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Payload() id: string) {
    try {
      return await this.userService.findOneById(id);

    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving user by ID',
        details: error.message,
      });

    }
  }

  @MessagePattern('findUserByIds')
  @HttpCode(HttpStatus.OK)
  async findUsersByIds(@Payload() ids: string): Promise<User[]> {
    try {
      const idsArray = ids.split(',').map(id => id.trim());
      return await this.userService.findUsersByIds(idsArray);

    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving users by IDs',
        details: error.message,
      });

    }
  }

  @MessagePattern('findUserByEmail')
  @HttpCode(HttpStatus.OK)
  async findOneByEmail(@Payload() email: string) {
    try {
      return await this.userService.findOneByEmail(email);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving user by email',
        details: error.message,
      });
    }
  }

  @MessagePattern('updateUser')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Payload() updateUser: UpdateUserInput) {
    try {
      return await this.userService.update(updateUser);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error updating user',
        details: error.message,
      });

    }
  }

  @MessagePattern('removeUser')
  @HttpCode(HttpStatus.OK)
  async removeUser(@Payload() id: string) {
    try {
      return await this.userService.remove(id);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error removing user',
        details: error.message,
      });

    }
  }

  @MessagePattern('validateUser')
  @HttpCode(HttpStatus.OK)
  async verifyPassword(
    @Payload() data: { email: string; password: string }
  ) {
    try {

      return await this.userService.validateUser(
        data.email,
        data.password
      );
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error validating user',
        details: error.message,
      });

    }
  }

  @MessagePattern('changeRole')
  @HttpCode(HttpStatus.OK)
  async changeUserRole(@Payload() data: { id: string; role: UserRole }) {
    try {
      return await this.userService.changeUserRole(data.id, data.role);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error changing user role',
        details: error.message,
      });

    }
  }
  @MessagePattern('updateSetting')
  @HttpCode(HttpStatus.OK)
  async updateSetting(@Payload() data: { id: string; setting: UpdateSettingInput }) {
    try {
      return await this.userService.updateSetting(data.id, data.setting);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error updating user setting',
        details: error.message,
      });

    }
  }
}
