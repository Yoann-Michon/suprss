import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Comments } from './entity/comment.entity';
import { Messages } from './entity/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Messages)
    private readonly messageRepository: MongoRepository<Messages>,
    @InjectRepository(Comments)
    private readonly commentRepository: MongoRepository<Comments>,
  ) { }

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

  async getMessageById(id: string): Promise<Messages | null> {
    try {
      return await this.messageRepository.findOne({
        where: { _id: new ObjectId(id) }
      });
    } catch (error) {
      return null;
    }
  }

  async createComment(createCommentDto: CreateCommentDto): Promise<Comments> {
    try {
      const comment = this.commentRepository.create(createCommentDto);
      return await this.commentRepository.save(comment);
    } catch (error) {

      throw new Error('Error creating comment: ' + error.message);
    }

  }

  async getCommentsByArticle(articleId: string): Promise<Comments[]> {
    return await this.commentRepository.find({
      where: { articleId },
      order: { createdAt: 'ASC' as any }
    });
  }

  async deleteComment(id: string): Promise<void> {
    try {
      const objectId = new ObjectId(id);
      const comment = await this.commentRepository.findOne({
        where: { _id: objectId }
      });
      
      if (!comment) {
        throw new Error('Comment not found');
      }
      
      await this.commentRepository.delete(comment.id);
    } catch (error) {
      if (error.message === 'Comment not found') {
        throw error;
      }
      throw new Error('Invalid comment ID format');
    }
  }
}
