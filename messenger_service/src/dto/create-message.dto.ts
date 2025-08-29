import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateMessageDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 500)
    content: string;

    @IsNotEmpty()
    @IsString()
    collectionId: string;
}
