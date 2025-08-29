import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  articleId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  content: string;
}
