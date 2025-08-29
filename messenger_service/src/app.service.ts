import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Comments } from './entity/comment.entity';
import { Messages } from './entity/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Messages)
    private readonly messageRepository: MongoRepository<Messages>,
    @InjectRepository(Comments)
    private readonly commentRepository: MongoRepository<Comments>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Messages> {
    const message = this.messageRepository.create(createMessageDto);
    return await this.messageRepository.save(message);
  }

  async getMessages(collectionId: string): Promise<Messages[]> {
    return await this.messageRepository.find({
      where: { collectionId },
      order: { createdAt: 'DESC' as any },
      take: 50
    });
  }

  async getMessageById(id: string): Promise<Messages|[]> {
    return await this.messageRepository.findOne({
      where: { id } as any
    }) || [];
  }

  async createComment(createCommentDto: CreateCommentDto): Promise<Comments> {
    const comment = this.commentRepository.create(createCommentDto);
    return await this.commentRepository.save(comment);
  }

  async getCommentsByArticle(articleId: string): Promise<Comments[]> {
    return await this.commentRepository.find({
      where: { articleId },
      order: { createdAt: 'ASC' as any }
    });
  }

  async deleteComment(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
