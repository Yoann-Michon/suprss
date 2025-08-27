import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UploadImgService } from './upload-img.service';
import { Setting } from './entities/Setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    TypeOrmModule.forFeature([User, Setting]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_NAME"),
        entities: [User, Setting],
        synchronize: true,
      }),
    }),
  ],
  providers: [UserService, UploadImgService],
})
export class UserModule { }