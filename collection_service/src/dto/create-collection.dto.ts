import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray, 
  ArrayUnique, 
  IsEnum, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { CollectionRole } from 'utils/src';

class CollaboratorDto {
  @IsString({ message: 'userId must be a valid string' })
  @IsNotEmpty({ message: 'userId cannot be empty' })
  userId: string;

  @IsEnum(CollectionRole, { message: 'role must be owner, moderator or reader' })
  role: CollectionRole;
}

export class CreateCollectionDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'ownerId must be a valid string' })
  @IsNotEmpty({ message: 'ownerId is required' })
  ownerId: string;

  @IsOptional()
  @IsArray({ message: 'articleIds must be an array' })
  @ArrayUnique({ message: 'articleIds must not contain duplicates' })
  @IsString({ each: true, message: 'Each articleId must be a valid string' })
  articleIds?: string[];

  @IsOptional()
  @IsArray({ message: 'collaborators must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CollaboratorDto)
  collaborators?: CollaboratorDto[];

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  isPrivate?: boolean = true;
}
