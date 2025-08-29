import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, Index } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity('comments')
@Index(['articleId', 'createdAt'])
export class Comments {
  @ObjectIdColumn()
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
