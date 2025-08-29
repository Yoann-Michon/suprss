import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Article } from 'src/entities/article.entity';
import { CreateArticleDto } from 'src/dto/create-article.dto';
import { ArticleStatus } from 'src/entities/feed.enum';

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
      throw new RpcException(`Failed to create article: ${error.message}`);
    }
  }

  async getArticlesByFeed(feedId: string): Promise<Article[]> {
    try {
      return await this.articleRepository.find({ where: { feedId } });
    } catch (error) {
      throw new RpcException(`Failed to fetch articles for feed ${feedId}: ${error.message}`);
    }
  }

  async markArticleAsRead(articleId: string): Promise<Article> {
    try {
      const article = await this.articleRepository.findOneBy({ id: articleId as any });
      if (!article) {
        throw new RpcException('Article not found');
      }
      article.status = ArticleStatus.READ;
      return await this.articleRepository.save(article);
    } catch (error) {
      throw new RpcException(`Failed to mark article as read: ${error.message}`);
    }
  }
}
