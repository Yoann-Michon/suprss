import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Feed } from './entities/feed.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { FeedFrequency } from './entities/feed.enum';
import { RssService } from './rss.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class FeedService {
  private readonly logger = new Logger(FeedService.name);
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: MongoRepository<Feed>,
    private readonly rssService: RssService
  ) { }

  async createFeed(createFeedDto: CreateFeedDto) {
    try {
      const feed = this.feedRepository.create({
        ...createFeedDto,
        frequency: createFeedDto.frequency as FeedFrequency,
      });
      const savedFeed = await this.feedRepository.save(feed);
      await this.rssService.fetchFeedArticles(savedFeed);
      return savedFeed;
    } catch (error) {
      throw new InternalServerErrorException(`Error creating rss feed: ${error}`);
    }
  }

  async findAll(userId: string){
    return await this.feedRepository.find({ where: { userId } });
  }

  async findOneFeed(id: string, userId: string){
    const feed = await this.feedRepository.findOneBy({ _id: new ObjectId(id), userId });
    if (!feed) throw new NotFoundException('Feed not found');
    return feed;
  }

  async updateFeed(updateFeedDto: UpdateFeedDto, userId: string){
    try{
      const { id, ...rest } = updateFeedDto;
      this.logger.log(`updateFeed - Data recu: ${JSON.stringify(updateFeedDto)}`);
      const feed = await this.feedRepository.findOneBy({ _id: new ObjectId(id), userId });
      if (!feed) throw new NotFoundException('Feed not found');
      Object.assign(feed, rest);
      return await this.feedRepository.save(feed);
    } catch (error) {
      this.logger.log(`Error updating rss feed: ${error}`);
      throw new InternalServerErrorException(`Error updating rss feed: ${error}`);
    }
  }

  async removeFeed(id: string, userId: string){
    const result = await this.feedRepository.deleteOne({ _id: new ObjectId(id), userId });
    if (result.deletedCount === 0) throw new NotFoundException('Feed not found');
    return result
  }
}
