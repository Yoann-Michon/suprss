import { Matches, IsNotEmpty, Length, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';

export class CreateUserInput {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 50, { message: 'Password must be between 6 and 50 characters' })
  @Matches(/.*[A-Z].*/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/.*[0-9].*/, { message: 'Password must contain at least one number' })
  @Matches(/.*[!@#$%^&*].*/, { message: 'Password must contain at least one special character (!@#$%^&*)' })
  password: string;

  @IsNotEmpty({ message: 'Role is required' })
  role: string;

  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @IsOptional()
  avatarUrl?: string;

  @IsNotEmpty({ message: 'First visit status is required' })
  firstVisit: boolean;
}