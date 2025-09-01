import { Column, Entity, ObjectIdColumn } from "typeorm";
import { ObjectId } from "mongodb";

@Entity("article")
export class Article {
    @ObjectIdColumn({ name: '_id' })
    id: ObjectId;

    @Column()
    title: string;

    @Column()
    feedId: string;

    @Column()
    link: string;

    @Column()
    pubDate: Date;

    @Column({ nullable: true })
    author: string;

    @Column({ nullable: true })
    excerpt: string;

    @Column({ nullable: true })
    userIdsRead: string[];

    @Column({ default: false })
    favorite: boolean;
}