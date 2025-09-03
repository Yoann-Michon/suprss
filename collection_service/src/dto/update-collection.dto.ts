import { CreateCollectionDto } from "./create-collection.dto";
import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
    @IsMongoId()
    id: string;
}
