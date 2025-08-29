import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, Index } from 'typeorm';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@Entity('messages')
@Index(['room', 'createdAt'])
export class Messages {
  @ObjectIdColumn()
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
