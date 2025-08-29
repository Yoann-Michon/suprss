import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './entity/comment.entity';
import { Messages } from './entity/message.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comments, Messages]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        host: configService.get<string>('MONGO_HOST'),
        port: configService.get<number>('MONGO_PORT'),
        username: configService.get<string>('MONGO_USERNAME'),
        password: configService.get<string>('MONGO_PASSWORD'),
        database: configService.get<string>('MONGO_NAME'),
        entities: [Comments, Messages],
        authSource: configService.get<string>('MONGO_AUTH_SOURCE'),
        synchronize: true,
      }),
    }),],
  controllers: [ AppController],
  providers: [ ChatGateway, AppService],
})
export class AppModule {}
