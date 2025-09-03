import { NestFactory } from '@nestjs/core';
import { CollectionModule } from './collection.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(CollectionModule,{
    logger: ['log', 'warn', 'error', 'debug', 'verbose'], 
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_HOST],
      queue: process.env.RABBITMQ_COLLECTION_QUEUE,
      queueOptions: {
        durable: true
      },
    },
  });
  await app.listen();
}
bootstrap();