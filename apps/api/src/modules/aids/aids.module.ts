// apps/api/src/modules/aids/aids.module.ts

import { Module } from '@nestjs/common';
import { AidsController } from './aids.controller';
import { AidsService } from './aids.service';

/**
 * Module Aids
 * 
 * Gère le catalogue des aides et subventions.
 * Expose des endpoints publics pour la consultation
 * et des endpoints protégés pour l'administration.
 */
@Module({
  controllers: [AidsController],
  providers: [AidsService],
  exports: [AidsService],
})
export class AidsModule {}
