// apps/api/src/modules/prisma/prisma.service.ts

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Service Prisma
 * Gère la connexion à la base de données PostgreSQL
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  /**
   * Connexion à la base de données au démarrage du module
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('✅ Connexion à la base de données établie');
    } catch (error) {
      this.logger.error('❌ Erreur de connexion à la base de données', error);
      throw error;
    }
  }

  /**
   * Déconnexion propre à l'arrêt du module
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('🔌 Déconnexion de la base de données');
  }

  /**
   * Nettoyer toutes les tables (utilisé pour les tests)
   * ATTENTION: Ne jamais utiliser en production !
   */
  async cleanDatabase(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('cleanDatabase ne peut pas être appelé en production');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && !key.startsWith('_') && !key.startsWith('$'),
    );

    for (const model of models) {
      const modelDelegate = this[model as keyof this];
      if (modelDelegate && typeof (modelDelegate as { deleteMany?: unknown }).deleteMany === 'function') {
        await (modelDelegate as { deleteMany: () => Promise<unknown> }).deleteMany();
      }
    }
  }
}
