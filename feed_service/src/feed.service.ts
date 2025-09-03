import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Feed } from './entities/feed.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { FeedFrequency } from './entities/feed.enum';
import { RssService } from './rss.service';
import { ObjectId } from 'mongodb';
import { parse as csvParse } from 'csv-parse/sync';
import * as xml2js from 'xml2js';

@Injectable()
export class FeedService {
  private readonly logger = new Logger(FeedService.name);

  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: MongoRepository<Feed>,
    private readonly rssService: RssService,
  ) {}

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
      throw new InternalServerErrorException('error.feed.create_failed');
    }
  }

  async findAll(userId: string) {
    return await this.feedRepository.find({ where: { userId } });
  }

  async findOneFeed(id: string, userId: string) {
    const feed = await this.feedRepository.findOneBy({
      _id: new ObjectId(id),
      userId,
    });
    if (!feed) throw new NotFoundException('error.feed.not_found');
    return feed;
  }

  async updateFeed(updateFeedDto: UpdateFeedDto, userId: string) {
    try {
      const { id, ...rest } = updateFeedDto;
      this.logger.log(
        `updateFeed - Data received: ${JSON.stringify(updateFeedDto)}`,
      );

      const feed = await this.feedRepository.findOneBy({
        _id: new ObjectId(id),
        userId,
      });
      if (!feed) throw new NotFoundException('error.feed.not_found');

      const oldTags = feed.tags;
      const newTags = rest.tags;
      const tagsChanged =
        JSON.stringify(oldTags?.sort()) !== JSON.stringify(newTags?.sort());

      Object.assign(feed, rest);
      const updatedFeed = await this.feedRepository.save(feed);

      if (tagsChanged) {
        this.logger.log(
          `Tags changed for feed ${id}. Updating existing articles...`,
        );
        setImmediate(async () => {
          try {
            const updatedCount = await this.rssService.updateArticleTagsForFeed(
              id,
              newTags,
            );
            this.logger.log(
              `Successfully updated tags for ${updatedCount} articles in feed ${id}`,
            );
          } catch (error) {
            this.logger.error(
              `Failed to update article tags for feed ${id}: ${error.message}`,
            );
          }
        });
      }

      return updatedFeed;
    } catch (error) {
      this.logger.error(`Error updating rss feed: ${error.message}`);
      throw new InternalServerErrorException('error.feed.update_failed');
    }
  }

  async removeFeed(id: string, userId: string) {
    const result = await this.feedRepository.deleteOne({
      _id: new ObjectId(id),
      userId,
    });
    if (result.deletedCount === 0)
      throw new NotFoundException('error.feed.not_found');
    return result;
  }

  async importFeeds(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new BadRequestException('error.feed.no_file');
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase();
    let feeds: any[] = [];

    try {
      switch (ext) {
        case 'json': {
          const jsonData = JSON.parse(file.buffer.toString());
          feeds = Array.isArray(jsonData) ? jsonData : jsonData.feeds || [];
          break;
        }

        case 'csv': {
          feeds = csvParse(file.buffer.toString(), {
            columns: true,
            skip_empty_lines: true,
          });
          break;
        }

        case 'opml':
        case 'xml': {
          const xml = file.buffer.toString();
          const parser = new xml2js.Parser();
          const result = await parser.parseStringPromise(xml);

          if (!result.opml?.body?.[0]?.outline) {
            throw new BadRequestException('error.feed.invalid_opml');
          }

          feeds = this.flattenOpml(result.opml.body[0].outline);
          break;
        }

        default:
          throw new BadRequestException('error.feed.unsupported_type');
      }

      return await this.createFeedsFromImport(feeds, userId);
    } catch (error) {
      this.logger.error(`Import failed: ${error.message}`);
      throw new BadRequestException('error.feed.import_failed');
    }
  }

  private flattenOpml(outlines: any[]): any[] {
    let feeds: any[] = [];

    const traverse = (items: any[]) => {
      if (!Array.isArray(items)) items = [items];

      for (const item of items) {
        if (item.$?.xmlUrl) {
          feeds.push({
            url: item.$.xmlUrl,
            name: item.$.title || item.$.text || 'Unknown Feed',
            description: item.$.description || '',
          });
        }
        if (item.outline) {
          traverse(item.outline);
        }
      }
    };

    traverse(outlines);
    return feeds;
  }

  private async createFeedsFromImport(feeds: any[], userId: string) {
    const results = {
      total: feeds.length,
      imported: 0,
      skipped: 0,
      errors: [] as string[],
    };

    const existingFeeds = await this.feedRepository.find({
      where: { userId },
      select: ['url'],
    });
    const existingUrls = new Set(existingFeeds.map((f) => f.url));

    for (const feedData of feeds) {
      try {
        const url = feedData.url || feedData.xmlUrl || feedData.feedUrl;
        const name =
          feedData.name || feedData.title || feedData.text || 'Unknown Feed';

        if (!url) {
          results.errors.push('error.feed.missing_url');
          continue;
        }

        if (existingUrls.has(url)) {
          results.skipped++;
          continue;
        }

        const createFeedDto: CreateFeedDto = {
          url,
          name,
          frequency: FeedFrequency.DAILY,
          description: feedData.description || '',
          tags: feedData.tags || [],
          userId,
        };

        await this.createFeed(createFeedDto);
        results.imported++;
        existingUrls.add(url);
      } catch (error) {
        results.errors.push('error.feed.import_item_failed');
      }
    }

    this.logger.log(
      `Import completed: ${results.imported}/${results.total} feeds imported, ${results.skipped} skipped`,
    );
    return results;
  }
}
