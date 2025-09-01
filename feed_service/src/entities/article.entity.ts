import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity("article")
export class Article {
    @ObjectIdColumn()
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