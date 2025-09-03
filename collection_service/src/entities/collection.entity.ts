import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CollectionRole } from 'utils/src';


@Entity('collection')
export class Collection {
  @ObjectIdColumn({ name: '_id' })
  id: ObjectId;

  @Column()
  name: string;

  @Column()
  ownerId: string;

  @Column('simple-array', { nullable: true })
  articleIds?: string[];

  @Column({ type: 'json', nullable: true })
  collaborators?: { userId: string; role: CollectionRole }[];

  @Column({ nullable: true })
  description?: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @Column({ default: true })
  isPrivate: boolean;
}
