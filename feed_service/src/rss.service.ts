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

        const article = this.articleRepository.create({
          title: item.title ?? 'Untitled',
          link: item.link,
          pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          author: item.creator ?? item.author ?? 'Unknown',
          excerpt: item.contentSnippet ?? '',
          feedId: feed.id.toString(),
          userIdsRead: [],
          favorite: false,
        });

        await this.articleRepository.save(article);
        newArticles.push(article);
      }

      return newArticles;
    } catch (err) {
      throw new RpcException('RSS fetch error');
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