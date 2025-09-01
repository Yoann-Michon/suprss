import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { FeedFrequency } from './feed.enum';

@Entity('feed')
export class Feed {
  @ObjectIdColumn({ name: '_id' })
  id: ObjectId;

  @Column()
  url: string;

  @Column()
  name: string;

  @Column()
  frequency: FeedFrequency;

  @Column({ nullable: true })
  description?: string;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column()
  userId: string;
}