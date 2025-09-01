import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Feed } from './entities/feed.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { FeedFrequency } from './entities/feed.enum';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: MongoRepository<Feed>,
  ) {}

  async createFeed(createFeedDto: CreateFeedDto){
  try {
    const feed = this.feedRepository.create({
      ...createFeedDto,
      frequency: createFeedDto.frequency as FeedFrequency,
    });
    return await this.feedRepository.save(feed);
  } catch (error) {
    throw new InternalServerErrorException(`Error creating rss feed: ${error}`);
  }
}

  async findAll(userId: string): Promise<Feed[]> {
    return await this.feedRepository.find({ where: { userId } });
  }

  async findOneFeed(id: string, userId: string): Promise<Feed> {
    const feed = await this.feedRepository.findOneBy({ id, userId });
    if (!feed) throw new NotFoundException('Feed not found');
    return feed;
  }

  async updateFeed(updateFeedDto: UpdateFeedDto, userId:string): Promise<Feed> {
    const { id, ...rest } = updateFeedDto;
    const feed = await this.feedRepository.findOneBy({ id, userId });
    if (!feed) throw new NotFoundException('Feed not found');
    Object.assign(feed, rest);
    return await this.feedRepository.save(feed);
  }

  async removeFeed(id: string, userId: string): Promise<void> {
    const result = await this.feedRepository.deleteOne({ id, userId });
    if (result.deletedCount === 0) throw new NotFoundException('Feed not found');
  }
}
