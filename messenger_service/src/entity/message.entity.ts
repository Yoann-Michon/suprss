import { Entity, ObjectIdColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ObjectId } from 'mongodb';

@Entity('messages')
@Index(['collectionId', 'createdAt'])
export class Messages {
  @ObjectIdColumn({ name: '_id' })
  id: ObjectId;

  @Column()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @Length(3, 500)
  content: string;

  @Column({ default: 'global' })
  collectionId: string;

  @CreateDateColumn()
  createdAt: Date;
}
