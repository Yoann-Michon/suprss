import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Article } from 'src/entities/article.entity';
import { CreateArticleDto } from 'src/dto/create-article.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: MongoRepository<Article>,
  ) {}

  async createArticle(articleDto: CreateArticleDto): Promise<Article> {
    try {
      const article = this.articleRepository.create(articleDto);
      return await this.articleRepository.save(article);
    } catch (error) {
      throw new RpcException('error.article.create_failed');
    }
  }

  async getArticlesByFeed(feedIds: string[]): Promise<Article[]> {
    try {
      return await this.articleRepository.find({
        where: {
          feedId: { $in: feedIds } as any,
        },
      });
    } catch (error) {
      throw new RpcException('error.article.fetch_failed');
    }
  }

  async markArticleAsRead(articleId: string, userId: string): Promise<Article> {
    try {
      const article = await this.articleRepository.findOneBy({
        _id: new ObjectId(articleId),
      });

      if (!article) {
        throw new RpcException('error.article.not_found');
      }

      if (!article.userIdsRead.includes(userId)) {
        article.userIdsRead.push(userId);
      }

      return await this.articleRepository.save(article);
    } catch (error) {
      throw new RpcException('error.article.mark_read_failed');
    }
  }

  async toggleFavorite(articleId: string): Promise<Article> {
    try {
      const article = await this.articleRepository.findOneBy({
        _id: new ObjectId(articleId),
      });

      if (!article) {
        throw new RpcException('error.article.not_found');
      }

      article.favorite = !article.favorite;

      return await this.articleRepository.save(article);
    } catch (error) {
      throw new RpcException('error.article.favorite_failed');
    }
  }
}
