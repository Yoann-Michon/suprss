import { Entity, Column, ObjectId, ObjectIdColumn } from 'typeorm';
import { FeedFrequency } from './feed.enum';

@Entity('feed')
export class Feed {
  @ObjectIdColumn()
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