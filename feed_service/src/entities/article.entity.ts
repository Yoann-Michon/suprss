import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";
import { ArticleStatus } from "./feed.enum";

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

    @Column({ default: ArticleStatus.UNREAD })
    status: ArticleStatus;

    @Column({ default: false })
    favorite: boolean;
}