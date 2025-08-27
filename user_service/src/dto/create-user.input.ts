import { UserRole } from '@guards/roles_guard/role.enum';
import { Matches, IsNotEmpty, Length, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class CreateUserInput {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'First name is required' })
  @Length(3, 50, { message: 'First name must be between 3 and 50 characters' })
  firstname: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @Length(3, 50, { message: 'Last name must be between 3 and 50 characters' })
  lastname: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 50, { message: 'Password must be between 6 and 50 characters' })
  @Matches(/.*[A-Z].*/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/.*[0-9].*/, { message: 'Password must contain at least one number' })
  @Matches(/.*[!@#$%^&*].*/, { message: 'Password must contain at least one special character (!@#$%^&*)' })
  password: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Role must be one of the following: USER' })
  role: UserRole;

  @IsOptional()
  username?: string;

  @IsOptional()
  avatarUrl?: string;

  @IsNotEmpty()
  firstVisit: boolean;
}