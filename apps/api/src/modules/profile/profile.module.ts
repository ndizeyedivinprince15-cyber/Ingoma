// apps/api/src/modules/profile/profile.module.ts

import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

/**
 * Module Profile
 * 
 * Gère les profils d'éligibilité des utilisateurs.
 * Un profil contient toutes les réponses au questionnaire
 * nécessaires pour évaluer l'éligibilité aux aides.
 */
@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
