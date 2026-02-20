// apps/api/src/main.ts

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

  // Configuration service pour récupérer les variables d'environnement
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // Préfixe global pour toutes les routes
  app.setGlobalPrefix('api');

  // Activation de CORS pour le frontend
  app.enableCors({
    origin: nodeEnv === 'production' 
      ? ['https://aidesmax.fr'] // À adapter en production
      : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      // Supprime les propriétés non décorées des DTOs
      whitelist: true,
      // Rejette les requêtes avec des propriétés non autorisées
      forbidNonWhitelisted: true,
      // Transforme automatiquement les types (string -> number, etc.)
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      // Messages d'erreur détaillés
      disableErrorMessages: nodeEnv === 'production',
    }),
  );

  // Filtre d'exception global pour formater les erreurs
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
  
  logger.log(`🚀 Application démarrée sur http://localhost:${port}/api`);
  logger.log(`📚 Environnement: ${nodeEnv}`);
}

bootstrap();
