import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_BASE_URL } from './config/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new ConfigService();
  app.enableCors({
    origin: config.get<string>(APP_BASE_URL),
  });
  app.use(helmet());
  const cfgSwagger = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('DIGITAL-MENU API')
    .setDescription('This is the digital menu API')
    .addTag('menu')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, cfgSwagger);
  SwaggerModule.setup('/api', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
