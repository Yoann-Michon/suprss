import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { Type } from "class-transformer";

export class CreateArticleDto {
    @IsString({ message: 'Title must be a string' })
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @IsUrl({}, { message: 'Link must be a valid URL' })
    @IsNotEmpty({ message: 'Link is required' })
    link: string;

    @Type(() => Date)
    @IsDate({ message: 'Publication date must be a valid Date' })
    @IsNotEmpty({ message: 'Publication date is required' })
    pubDate: Date;

    @IsString({ message: 'Author must be a string' })
    @IsOptional()
    author?: string;

    @IsString({ message: 'Excerpt must be a string' })
    @IsOptional()
    excerpt?: string;

    @IsString({ message: 'Feed ID must be a string' })
    @IsNotEmpty({ message: 'Feed ID is required' })
    feedId: string;

    @IsOptional()
    @IsString({ each: true, message: 'Each userId must be a string' })
    userIdsRead?: string[];

    @IsBoolean({ message: 'Favorite must be a boolean' })
    @IsOptional()
    favorite?: boolean;

    @IsOptional()
    @IsString({ each: true, message: 'Each tag must be a string' })
    tags?: string[];
}
