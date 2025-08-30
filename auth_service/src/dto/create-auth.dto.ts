import { IsEmail, IsNotEmpty, Length, Matches, MinLength } from 'class-validator';

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

    @IsNotEmpty({ message: 'Username is required' })
    @MinLength(4)
    username: string;
}