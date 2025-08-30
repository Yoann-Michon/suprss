import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException,  Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdateSettingInput } from './dto/update-setting.input';
import { Setting } from './entities/Setting.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Setting) private readonly settingRepository: Repository<Setting>
  ) { }

  async create(createUserInput: CreateUserInput){
    try {
      this.logger.log(`Creating user with: ${createUserInput.email}`);
      const user = await this.findOneByEmail(createUserInput.email);
      
      if (user) {
        throw new BadRequestException('User already exist');
      }
      const hashedPassword = await bcrypt.hash(createUserInput.password, Number(process.env.SALT));
      const setting = this.settingRepository.create();
      
      const newUser = new User();
      newUser.email = createUserInput.email;
      newUser.password = hashedPassword;
      newUser.username = createUserInput.username ;
      newUser.role = "Admin";
      newUser.avatarUrl = "";
      newUser.firstVisit = true;
      newUser.setting = setting;
      this.logger.log(`New user to be saved: ${JSON.stringify(newUser)}`);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error creating user: ${error}`);
      throw new InternalServerErrorException(`Error creating user: ${error}`);
    }
  }

  async findAll(): Promise<User[] | null> {
    try {
      return await this.usersRepository.find() || null;
    } catch (error) {
      throw new InternalServerErrorException(`Error retrieving users: ${error}`);
    }
  }

  async findOneById(id: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOneBy({ id }) || null;
    } catch (error) {
      throw new InternalServerErrorException(`Error retrieving user by ID: ${error}`);
    }
  }

  async findUsersByIds(ids: string[]): Promise<User[]> {
    try {
      return await this.usersRepository.findBy({ id: In(ids) });
    } catch (error) {
      throw new InternalServerErrorException(`Error retrieving users by IDs: ${error}`);
    }
  }
  
  async findOneByEmail(email: string): Promise<User | null> {
  try {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne() || null;
  } catch (error) {
    throw new InternalServerErrorException(`Error retrieving user by email: ${error}`);
  }
}

  async update(updateUserInput: UpdateUserInput) {
    try {
      const user = await this.findOneById(updateUserInput.id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (updateUserInput.password) {
      updateUserInput.password = await bcrypt.hash(updateUserInput.password, Number(process.env.SALT) || 10);
    }
      const updatedUser = {
        ...user,
        ...updateUserInput
      };
      return await this.usersRepository.save(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; 
      }
      throw new InternalServerErrorException(`Error updating user: ${error}`);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findOneById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return await this.usersRepository.delete({ id });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error deleting user: ${error}`);
    }
  }

  async validateUser(email:string, password:string): Promise<User | null> {
    try {
      const user = await this.findOneByEmail(email);
      this.logger.log(`Validating user: ${JSON.stringify(user)}`);
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error(`Error validating user: ${error}`);
      throw new InternalServerErrorException(`Error validating user: ${error}`);
    }
  }

  //async changeUserRole(userId: string, role: UserRole): Promise<User> {
  //  try {
  //    const user = await this.findOneById(userId);
  //    if (!user) {
  //      throw new NotFoundException('User not found');
  //    }
  //    
  //    user.role = role;
  //    return await this.usersRepository.save(user);
  //  } catch (error) {
  //    if (error instanceof NotFoundException) {
  //      throw error;
  //    }
  //    throw new InternalServerErrorException(`Error changing user role: ${error}`);
  //  }
  //}

  async updateSetting(userId: string, prefs: UpdateSettingInput) {
  const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['setting'] });

  if (!user) throw new Error('User not found');

  if (!user.setting) {
    user.setting = this.settingRepository.create(prefs);
  } else {
    Object.assign(user.setting, prefs);
  }

  return this.usersRepository.save(user);
}

}
