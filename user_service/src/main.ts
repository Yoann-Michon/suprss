import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserModule,{
    logger: ['log', 'warn', 'error', 'debug', 'verbose'], 
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_HOST],
      queue: process.env.RABBITMQ_USER_QUEUE,
      queueOptions: {
        durable: true
      },
    },
  });
  await app.listen();
}
bootstrap();
