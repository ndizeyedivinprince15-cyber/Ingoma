import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: nodeEnv === 'production' 
      ? ['https://ingoma-web.vercel.app', 'https://aidesmax.fr']
      : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: nodeEnv === 'production',
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  if (process.env.VERCEL) {
    await app.init();
    module.exports = app.getHttpAdapter().getInstance();
  } else {
    await app.listen(port);
    logger.log(`🚀 Application démarrée sur http://localhost:${port}/api`);
    logger.log(`📚 Environnement: ${nodeEnv}`);
  }
}

bootstrap();
