import { IsEmail, IsNotEmpty, Length, Matches, IsOptional } from 'class-validator';

export class CreateAuthDto {
    @IsNotEmpty({ message: 'Password is required' })
    @Length(6, 50)
    @Matches(/.*[A-Z].*/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/.*[0-9].*/, { message: 'Password must contain at least one number' })
    @Matches(/.*[!@#$%^&*].*/, { message: 'Password must contain at least one special character' })
    password: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'The email is invalid' })
    email: string;

    @IsOptional()
    username?: string;

    @IsNotEmpty({ message: 'First name is required' })
    @Length(3, 50, { message: 'First name must be between 3 and 50 characters' })
    firstname: string;

    @IsNotEmpty({ message: 'Last name is required' })
    @Length(3, 50, { message: 'Last name must be between 3 and 50 characters' })
    lastname: string;
}