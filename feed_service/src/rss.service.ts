import { Injectable } from "@nestjs/common";
import { Feed } from "./entities/feed.entity";
import { RpcException } from "@nestjs/microservices";
import { Article } from "./entities/article.entity";
import { FeedFrequency, FrequencyCronMap} from "./entities/feed.enum";
import * as Parser from 'rss-parser';
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository, Repository } from "typeorm";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class RssService {
    private readonly parser = new Parser();
    constructor(
    @InjectRepository(Article) private readonly articleRepository: MongoRepository<Article>,
    @InjectRepository(Feed) private readonly feedRepository: Repository<Feed>

  ) { }
    async fetchFeedArticles(feed: Feed): Promise<Article[]> {
        try {
            const parsed = await this.parser.parseURL(feed.url);

            const existingArticles = await this.articleRepository.find({
                where: { feedId: feed.id.toString() },
                select: ['link'],
            });
            const existingLinks = new Set(existingArticles.map(a => a.link));

            const newArticles: Article[] = [];

            for (const item of parsed.items) {
                if (!item.link || existingLinks.has(item.link)) continue;

                const inheritedTags = this.processInheritedTags(feed.tags);

                const article = this.articleRepository.create({
                    title: item.title ?? 'Untitled',
                    link: item.link,
                    pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                    author: item.creator ?? item.author ?? 'Unknown',
                    excerpt: item.description ?? '',
                    feedId: feed.id.toString(),
                    userIdsRead: [],
                    favorite: false,
                    tags: inheritedTags
                });

                await this.articleRepository.save(article);
                newArticles.push(article);

            }

            return newArticles;
        } catch (err) {
            throw new RpcException(`RSS fetch error: ${err.message}`);
        }
    }

    private processInheritedTags(feedTags?: string[]): string[] | undefined {
        if (!feedTags || !Array.isArray(feedTags)) {
            return undefined;
        }

        return feedTags.filter(tag => {
            return typeof tag === 'string' && tag.trim().length > 0;
        }).map(tag => tag.trim());
    }

    async updateArticleTagsForFeed(feedId: string, newTags?: string[]): Promise<number> {
        try {
            const articles = await this.articleRepository.find({
                where: { feedId: feedId }
            });

            const processedTags = this.processInheritedTags(newTags);

            let updatedCount = 0;
            for (const article of articles) {
                article.tags = processedTags;
                await this.articleRepository.save(article);
                updatedCount++;
            }

            return updatedCount;
        } catch (error) {
            throw new RpcException(`Error updating article tags: ${error.message}`);
        }
    }

   async fetchFeedsByFrequency(frequency: FeedFrequency): Promise<void> {
    const feeds = await this.feedRepository.find({ where: { frequency } });
    for (const feed of feeds) {
      await this.fetchFeedArticles(feed);
    }
  }

  @Cron(FrequencyCronMap[FeedFrequency.WEEKLY])
  async handleFrequentFeeds() {
    const feeds = await this.feedRepository.find({ where: { frequency: FeedFrequency.WEEKLY } });
    for (const feed of feeds) {
      await this.fetchFeedArticles(feed);
    }
  }

  @Cron(FrequencyCronMap[FeedFrequency.HOURLY])
  async handleHourlyFeeds() {
    const feeds = await this.feedRepository.find({ where: { frequency: FeedFrequency.HOURLY } });
    for (const feed of feeds) {
      await this.fetchFeedArticles(feed);
    }
  }

  @Cron(FrequencyCronMap[FeedFrequency.DAILY])
  async handleDailyFeeds() {
    const feeds = await this.feedRepository.find({ where: { frequency: FeedFrequency.DAILY } });
    for (const feed of feeds) {
      await this.fetchFeedArticles(feed);
    }
  }
}