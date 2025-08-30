import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Controller, HttpStatus, } from '@nestjs/common';
import { UpdateSettingInput } from './dto/update-setting.input';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @MessagePattern('createUser')
  async createUser(@Payload() createUserInput: CreateUserInput) {
    try {
      return await this.userService.create(createUserInput);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating user',
      });
    }
  }

  @MessagePattern('findAllUsers')
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving users',
      });

    }
  }

  @MessagePattern('findUserById')
  async findOneById(@Payload() id: string) {
    try {
      return await this.userService.findOneById(id);

    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving user by ID',
      });

    }
  }

  @MessagePattern('findUserByIds')
  async findUsersByIds(@Payload() ids: string): Promise<User[]> {
    try {
      const idsArray = ids.split(',').map(id => id.trim());
      return await this.userService.findUsersByIds(idsArray);

    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving users by IDs',
      });

    }
  }

  @MessagePattern('findUserByEmail')
  async findOneByEmail(@Payload() email: string) {
    try {
      return await this.userService.findOneByEmail(email);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving user by email',
      });
    }
  }

  @MessagePattern('updateUser')
  async updateUser(@Payload() updateUser: UpdateUserInput) {
    try {
      return await this.userService.update(updateUser);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error updating user',
      });

    }
  }

  @MessagePattern('removeUser')
  async removeUser(@Payload() id: string) {
    try {
      return await this.userService.remove(id);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error removing user',
      });

    }
  }

  @MessagePattern('validateUser')
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
      });

    }
  }

  //@MessagePattern('changeRole')
  //async changeUserRole(@Payload() data: { id: string; role: UserRole }) {
  //  try {
  //    return await this.userService.changeUserRole(data.id, data.role);
  //  } catch (error) {
  //    throw new RpcException({
  //      status: HttpStatus.INTERNAL_SERVER_ERROR,
  //      message: 'Error changing user role',
  //    });
//
  //  }
  //}
  @MessagePattern('updateSetting')
  async updateSetting(@Payload() data: { id: string; setting: UpdateSettingInput }) {
    try {
      return await this.userService.updateSetting(data.id, data.setting);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error updating user setting',
      });

    }
  }
}
