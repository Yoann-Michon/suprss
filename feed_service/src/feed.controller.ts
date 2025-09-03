import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
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
  async createFeed(@Payload() data: CreateFeedDto) {
    return this.feedService.createFeed(data);
  }

  @MessagePattern('updateFeed')
  async updateFeed(@Payload() data: { update: UpdateFeedDto, userId: string }) {
    return this.feedService.updateFeed(data.update, data.userId);
  }

  @MessagePattern('getFeeds')
  async getFeeds(@Payload() userId: string ) {
    return this.feedService.findAll(userId);
  }

  @MessagePattern('deleteFeed')
  async deleteFeed(@Payload() data: { feedId: string,userId:string }) {
    return this.feedService.removeFeed(data.feedId,data.userId);
  }

  @MessagePattern('importFeeds')
  async importFeeds(@Payload() data: { fileBuffer: Buffer, fileName: string, userId: string }) {
    const file = {
      buffer: Buffer.from(data.fileBuffer),
      originalname: data.fileName
    } as Express.Multer.File;

    return this.feedService.importFeeds(file, data.userId);
  }

  // === ARTICLES ===

  @MessagePattern('getArticlesByFeed')
  async getArticlesByFeed(@Payload() feedIds: string[]) {
    return this.articleService.getArticlesByFeed(feedIds );
  }

  @MessagePattern('markArticleAsRead')
  async markArticleAsRead(@Payload() data: { articleId: string , userId: string }) {
    return this.articleService.markArticleAsRead(data.articleId, data.userId);
  }

  @MessagePattern('toggleFavorite')
  async toggleFavorite(@Payload()  articleId: string) {
    return this.articleService.toggleFavorite(articleId);
  }

  // === RSS FETCH ===
  @MessagePattern('fetchFeedsByFrequency')
  async fetchFeedsByFrequency(@Payload() data: { frequency: FeedFrequency }) {
    return this.rssService.fetchFeedsByFrequency(data.frequency);
  }
}
