import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from '../app.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'incidents', 
  cors: {
    origin: true,
    credentials: true
  },
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  private logger: Logger = new Logger('ChatGateway');
  @WebSocketServer()
  server: Server;
  
  constructor(private appService: AppService) {}
  handleConnection(client: Socket) {
    this.logger.log(`Client connecté: ${client.id}`);
    client.emit('connection', 'Connexion établie avec succès');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client déconnecté: ${client.id}`);
  }
  
 @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data:string
  ) {
    await client.join(data);
    this.logger.log(`Client ${client.id} a rejoint la room ${data}`);
    client.emit('joinedRoom', data);
  }

  
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto
  ) {
    try {
      const savedMessage = await this.appService.createMessage(createMessageDto);
      
      const room = createMessageDto.collectionId;
      this.server.to(room).emit('newMessage', {
        id: savedMessage.id,
        userId: savedMessage.userId,
        content: savedMessage.content,
        collectionId: savedMessage.collectionId,
        createdAt: savedMessage.createdAt
      });

      this.logger.log(`Message envoyé dans la room ${room} par ${createMessageDto.userId}`);
    } catch (error) {
      this.logger.error('Erreur lors de l\'envoi du message:', error);
      client.emit('error', 'Erreur lors de l\'envoi du message');
    }
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string
  ) {
    try {
      const messages = await this.appService.getMessages(data);
      client.emit('messagesList', messages);
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des messages:', error);
      client.emit('error', 'Erreur lors de la récupération des messages');
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data:string
  ) {
    await client.leave(data);
    this.logger.log(`Client ${client.id} a quitté la room ${data}`);
    client.emit('leftRoom', data);
  }
}
