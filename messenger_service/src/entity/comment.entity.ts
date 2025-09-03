import { Entity, ObjectIdColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

@Entity('comments')
@Index(['articleId', 'createdAt'])
export class Comments {
  @ObjectIdColumn({ name: '_id' })
  id: ObjectId;

  @Column()
  @IsNotEmpty()
  @IsString()
  articleId: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
