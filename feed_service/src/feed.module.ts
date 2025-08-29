import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Feed } from './entities/feed.entity';
import { Article } from './entities/article.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN},
    }),
    ClientsModule.registerAsync([
        {
          name: 'AUTH_SERVICE',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RABBITMQ_HOST') || ''],
              queue: configService.get<string>('RABBITMQ_AUTH_QUEUE'),
              queueOptions: { durable: true },
            },
          }),
        },
        {
        name: 'API_GATEWAY_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_HOST') || ''],
            queue: configService.get<string>('RABBITMQ_API_GATEWAY_QUEUE'),
            queueOptions: { durable: true },
          },
        }),
      }
    ]),
    TypeOrmModule.forFeature([Feed, Article]),
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
        entities: [Feed, Article],
        authSource: configService.get<string>('MONGO_AUTH_SOURCE'),
        synchronize: true,
      }),
    }),
  ],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
