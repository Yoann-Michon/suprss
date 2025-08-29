import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { CreateFeedDto } from './create-feed.dto';

export class UpdateFeedDto extends PartialType(CreateFeedDto) {
  @IsMongoId()
  id: string;
}