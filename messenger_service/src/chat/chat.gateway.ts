import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from '../app.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Logger } from '@nestjs/common';


interface ConnectedUser {
  id: string;
  userId: string;
  username: string;
  collectionId: string;
  joinedAt: Date;
}

@WebSocketGateway({
  namespace: 'Chatroom', 
  cors: {
    origin: true,
    credentials: true
  },
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  private logger: Logger = new Logger('ChatGateway');
  private connectedUsers: Map<string, ConnectedUser> = new Map();

  @WebSocketServer()
  server: Server;
  
  constructor(private appService: AppService) {}
  handleConnection(client: Socket) {
    this.logger.log(`Client connecté: ${client.id}`);
    client.emit('connected', { 
      message: 'Connexion établie avec succès',
      clientId: client.id 
    });
  }

  handleDisconnect(client: Socket) {
    const user = this.connectedUsers.get(client.id);
    if (user) {
      this.server.to(`collection_${user.collectionId}`).emit('userLeft', {
        userId: user.userId,
        username: user.username,
        leftAt: new Date()
      });
      
      this.connectedUsers.delete(client.id);
      this.updateOnlineUsers(user.collectionId);
    }
    
    this.logger.log(`Client déconnecté: ${client.id}`);
  }
  
@SubscribeMessage('joinCollection')
  async handleJoinCollection(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      collectionId: string;
      userId: string;
      username: string;
    }
  ) {
    try {
      const { collectionId, userId, username } = data;

      if (!collectionId || !userId || !username) {
        client.emit('error', 'Données incomplètes pour rejoindre la collection');
        return;
      }

      const roomName = `collection_${collectionId}`;
      
      await client.join(roomName);

      const connectedUser: ConnectedUser = {
        id: client.id,
        userId,
        username,
        collectionId,
        joinedAt: new Date()
      };
      this.connectedUsers.set(client.id, connectedUser);

      client.to(roomName).emit('userJoined', {
        userId,
        username,
        joinedAt: connectedUser.joinedAt
      });

      client.emit('joinedCollection', {
        collectionId,
        roomName,
        message: `Vous avez rejoint la collection ${collectionId}`
      });

      const recentMessages = await this.appService.getMessages(collectionId);
      client.emit('messageHistory', recentMessages);

      this.updateOnlineUsers(collectionId);

      this.logger.log(`${username} (${userId}) a rejoint la collection ${collectionId}`);
    } catch (error) {
      this.logger.error('Erreur lors de la connexion à la collection:', error.message);
      client.emit('error', 'Erreur lors de la connexion à la collection');
    }
  }

  
 @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageData: CreateMessageDto & { username: string }
  ) {
    try {
      const user = this.connectedUsers.get(client.id);
      if (!user) {
        client.emit('error', 'Utilisateur non connecté à une collection');
        return;
      }

      if (!messageData.content?.trim()) {
        client.emit('error', 'Le message ne peut pas être vide');
        return;
      }

      if (messageData.content.length > 500) {
        client.emit('error', 'Le message est trop long (max 500 caractères)');
        return;
      }

      const savedMessage = await this.appService.createMessage({
        userId: messageData.userId,
        content: messageData.content.trim(),
        collectionId: messageData.collectionId
      });

      const messageToSend = {
        id: savedMessage.id,
        userId: savedMessage.userId,
        username: messageData.username,
        content: savedMessage.content,
        collectionId: savedMessage.collectionId,
        createdAt: savedMessage.createdAt
      };

      const roomName = `collection_${messageData.collectionId}`;
      this.server.to(roomName).emit('newMessage', messageToSend);

      this.logger.log(`Message envoyé dans la collection ${messageData.collectionId} par ${messageData.username}`);
    } catch (error) {
      this.logger.error('Erreur lors de l\'envoi du message:', error.message);
      client.emit('error', 'Erreur lors de l\'envoi du message');
    }
  }
 @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      collectionId: string;
      userId: string;
      username: string;
      isTyping: boolean;
    }
  ) {
    const roomName = `collection_${data.collectionId}`;
    
    client.to(roomName).emit('userTyping', {
      userId: data.userId,
      username: data.username,
      isTyping: data.isTyping
    });
  }

  @SubscribeMessage('getOnlineUsers')
  async handleGetOnlineUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { collectionId: string }
  ) {
    const onlineUsers = this.getOnlineUsersByCollection(data.collectionId);
    client.emit('onlineUsers', { collectionId: data.collectionId, users: onlineUsers });
  }

  @SubscribeMessage('leaveCollection')
  async handleLeaveCollection(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { collectionId: string }
  ) {
    try {
      const user = this.connectedUsers.get(client.id);
      if (!user) return;

      const roomName = `collection_${data.collectionId}`;
      
      await client.leave(roomName);
      
      client.to(roomName).emit('userLeft', {
        userId: user.userId,
        username: user.username,
        leftAt: new Date()
      });

      this.connectedUsers.delete(client.id);
      
      this.updateOnlineUsers(data.collectionId);

      client.emit('leftCollection', { collectionId: data.collectionId });
      
      this.logger.log(`${user.username} a quitté la collection ${data.collectionId}`);
    } catch (error) {
      this.logger.error('Erreur lors de la déconnexion de la collection:', error.message);
      client.emit('error', 'Erreur lors de la déconnexion');
    }
  }

  private updateOnlineUsers(collectionId: string) {
    const onlineUsers = this.getOnlineUsersByCollection(collectionId);
    const roomName = `collection_${collectionId}`;
    
    this.server.to(roomName).emit('onlineUsersUpdated', {
      collectionId,
      users: onlineUsers,
      count: onlineUsers.length
    });
  }

  private getOnlineUsersByCollection(collectionId: string): ConnectedUser[] {
    return Array.from(this.connectedUsers.values())
      .filter(user => user.collectionId === collectionId);
  }

  public notifyCollectionUpdate(collectionId: string, updateData: any) {
    const roomName = `collection_${collectionId}`;
    this.server.to(roomName).emit('collectionUpdated', updateData);
  }

  public sendSystemMessage(collectionId: string, message: string, type: 'info' | 'warning' | 'success' = 'info') {
    const roomName = `collection_${collectionId}`;
    this.server.to(roomName).emit('systemMessage', {
      message,
      type,
      timestamp: new Date(),
      id: `system_${Date.now()}`
    });
  }
}
