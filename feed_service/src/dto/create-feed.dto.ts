import { IsEnum, IsOptional, IsString, IsUrl, IsNotEmpty, IsArray } from 'class-validator';
import { FeedFrequency } from 'src/entities/feed.enum';


export class CreateFeedDto {
  @IsUrl({}, { message: 'URL must be a valid URL' })
  @IsNotEmpty({ message: 'URL is required' })
  url: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEnum(FeedFrequency, { message: 'Frequency must be Hourly, Weekly, or Daily' })
  @IsNotEmpty({ message: 'Frequency is required' })
  frequency: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsArray({ message: 'Tags must be an array of strings' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @IsOptional()
  tags?: string[];
  
}
