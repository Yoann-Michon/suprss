import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { FeedFrequency } from './entities/feed.enum';
import { ArticleService } from './article.service';
import { RssService } from './rss.service';

@Controller()
export class FeedController {
  constructor(private readonly feedService: FeedService,
    private readonly articleService: ArticleService,
    private readonly rssService: RssService,
  ) {}

  // === FEED ===
  @MessagePattern('createFeed')
  async createFeed(@Payload() data: { feed: CreateFeedDto; userId: string }) {
    return this.feedService.createFeed(data.feed, data.userId);
  }

  @MessagePattern('updateFeed')
  async updateFeed(@Payload() data: { feedId: string; update: UpdateFeedDto }) {
    return this.feedService.updateFeed(data.update,data.feedId);
  }

  @MessagePattern('getFeeds')
  async getFeeds(@Payload() data: { userId: string }) {
    return this.feedService.findAll(data.userId);
  }

  @MessagePattern('deleteFeed')
  async deleteFeed(@Payload() data: { feedId: string,userId:string }) {
    return this.feedService.removeFeed(data.feedId,data.userId);
  }

  // === ARTICLES ===
  @MessagePattern('createArticle')
  async createArticle(@Payload() article: CreateArticleDto) {
    return this.articleService.createArticle(article);
  }

  @MessagePattern('getArticlesByFeed')
  async getArticlesByFeed(@Payload() data: { feedId: string }) {
    return this.articleService.getArticlesByFeed(data.feedId);
  }

  @MessagePattern('markArticleAsRead')
  async markArticleAsRead(@Payload() data: { articleId: string }) {
    return this.articleService.markArticleAsRead(data.articleId);
  }

  // === RSS FETCH ===
  @MessagePattern('fetchFeedsByFrequency')
  async fetchFeedsByFrequency(@Payload() data: { frequency: FeedFrequency }) {
    return this.rssService.fetchFeedsByFrequency(data.frequency);
  }
}
