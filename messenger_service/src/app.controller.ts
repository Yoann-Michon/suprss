import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ChatGateway } from './chat/chat.gateway';

@Controller()
export class AppController {
 private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService,
      private readonly chatGateway: ChatGateway
  ) {}

  @MessagePattern('getMessages')
  async getMessages(@Payload() data: { collectionId: string }, @Ctx() context: RmqContext) {
    this.logger.log(`Réception message RabbitMQ: get_messages - Collection: ${data.collectionId}`);
    
    try {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      
      const result = await this.appService.getMessages(data.collectionId);
      
      channel.ack(originalMsg);
      
      this.logger.log(`${result.length} messages récupérés`);
      return {
        success: true,
        data: result,
        count: result.length
      };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des messages:', error.message);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, false);
      throw error;
    }
  }

  @MessagePattern('getMessageById')
  async getMessageById(@Payload() data: { id: string }, @Ctx() context: RmqContext) {
    this.logger.log(`Réception message RabbitMQ: get_message_by_id - ID: ${data.id}`);
    
    try {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      
      const result = await this.appService.getMessageById(data.id);
      
      channel.ack(originalMsg);
      
      this.logger.log(`Message récupéré: ${data.id}`);
      return {
        success: true,
        data: result,
        found: Array.isArray(result) ? result.length > 0 : !!result
      };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération du message:', error.message);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, false);
      throw error;
    }
  }

  @MessagePattern('createComment')
  async createComment(@Payload() data: CreateCommentDto, @Ctx() context: RmqContext) {
    this.logger.log('Réception message RabbitMQ: create_comment');
    
    try {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      
      const result = await this.appService.createComment(data);
      
      channel.ack(originalMsg);
      
      this.logger.log(`Commentaire créé avec succès: ${result.id}`);
      return {
        success: true,
        data: result,
        message: 'Commentaire créé avec succès'
      };
    } catch (error) {
      this.logger.error('Erreur lors de la création du commentaire:', error.message);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, false);
      throw error;
    }
  }

  @MessagePattern('getCommentsByArticle')
  async getComments(@Payload() data: { articleId: string }, @Ctx() context: RmqContext) {
    this.logger.log(`Réception message RabbitMQ: get_comments_by_article - Article: ${data.articleId}`);
    
    try {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      
      const result = await this.appService.getCommentsByArticle(data.articleId);
      
      channel.ack(originalMsg);
      
      this.logger.log(`${result.length} commentaires récupérés pour l'article ${data.articleId}`);
      return {
        success: true,
        data: result,
        count: result.length
      };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des commentaires:', error.message);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, false);
      throw error;
    }
  }

  @MessagePattern('deleteComment')
  async deleteComment(@Payload() data: { id: string }, @Ctx() context: RmqContext) {
    this.logger.log(`Réception message RabbitMQ: delete_comment - ID: ${data.id}`);
    
    try {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      
      await this.appService.deleteComment(data.id);
      
      channel.ack(originalMsg);
      
      this.logger.log(`Commentaire supprimé avec succès: ${data.id}`);
      return {
        success: true,
        message: 'Commentaire supprimé avec succès'
      };
    } catch (error) {
      this.logger.error('Erreur lors de la suppression du commentaire:', error.message);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, false);
      throw error;
    }
  }

  @MessagePattern('createChatroom')
  async handleCreateChatroom(@Payload() collection: { id: string, name?: string }, @Ctx() context: RmqContext) {
    this.logger.log(`Réception message RabbitMQ: createChatroom - Collection: ${collection.id}`);
    
    try {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      
      this.chatGateway.sendSystemMessage(collection.id, `Chatroom créée pour la collection ${collection.name || collection.id}`, 'success');
      
      channel.ack(originalMsg);
      
      this.logger.log(`Chatroom initialisée pour la collection ${collection.id}`);
      return {
        success: true,
        message: 'Chatroom créée avec succès',
        data: { collectionId: collection.id }
      };
    } catch (error) {
      this.logger.error('Erreur lors de la création de la chatroom:', error.message);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.nack(originalMsg, false, false);
      throw error;
    }
  }
}
