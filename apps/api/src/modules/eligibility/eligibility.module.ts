// apps/api/src/modules/eligibility/eligibility.module.ts

import { Module } from '@nestjs/common';
import { EligibilityController } from './eligibility.controller';
import { EligibilityService } from './eligibility.service';
import { EligibilityEngineService } from './eligibility-engine.service';
import { AidsModule } from '../aids/aids.module';
import { ProfileModule } from '../profile/profile.module';

/**
 * Module Eligibility
 * 
 * Gère l'évaluation de l'éligibilité des utilisateurs aux différentes aides.
 * C'est le cœur métier de l'application AidesMax.
 * 
 * Dépendances :
 * - AidsModule : pour récupérer les aides et leurs règles
 * - ProfileModule : pour récupérer les profils utilisateur
 * - PrismaModule (global) : pour persister les résultats
 */
@Module({
  imports: [
    AidsModule,
    ProfileModule,
  ],
  controllers: [EligibilityController],
  providers: [
    EligibilityService,
    EligibilityEngineService,
  ],
  exports: [
    EligibilityService,
    EligibilityEngineService,
  ],
})
export class EligibilityModule {}
