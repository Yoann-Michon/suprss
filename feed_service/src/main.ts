import { NestFactory } from '@nestjs/core';
import { FeedModule } from './feed.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(FeedModule,{
    logger: ['log', 'warn', 'error', 'debug', 'verbose'], 
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_HOST],
      queue: process.env.RABBITMQ_FEED_QUEUE,
      queueOptions: {
        durable: true
      },
    },
  });
  await app.listen();
}
bootstrap();

