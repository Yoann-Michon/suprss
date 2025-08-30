import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization'],
    credentials: true,
  });
  app.use(cookieParser());
  //try {
  //  const yamlFile = fs.readFileSync('./swagger-spec.yaml', 'utf8');
  //  const document = yaml.load(yamlFile) as OpenAPIObject;
  //  SwaggerModule.setup('api/v1/docs', app, document);
  //} catch (error) {
  //  console.error('Erreur lors du chargement du fichier Swagger:', error);
  //}
  await app.listen(process.env.PORT!);
}
bootstrap();

