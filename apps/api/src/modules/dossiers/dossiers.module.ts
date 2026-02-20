// apps/api/src/modules/dossiers/dossiers.module.ts

import { Module } from '@nestjs/common';
import { DossiersController } from './dossiers.controller';
import { DossiersService } from './dossiers.service';
import { DocumentGeneratorService } from './document-generator.service';
import { AidsModule } from '../aids/aids.module';
import { ProfileModule } from '../profile/profile.module';

/**
 * Module Dossiers
 * 
 * Gère les dossiers de demande d'aide des utilisateurs.
 * 
 * Fonctionnalités :
 * - Création de dossiers pré-remplis
 * - Génération de documents de demande
 * - Suivi du cycle de vie des dossiers
 * 
 * Dépendances :
 * - AidsModule : pour récupérer les informations des aides
 * - ProfileModule : pour pré-remplir les dossiers depuis le profil
 * - PrismaModule (global) : pour la persistance
 */
@Module({
  imports: [
    AidsModule,
    ProfileModule,
  ],
  controllers: [DossiersController],
  providers: [
    DossiersService,
    DocumentGeneratorService,
  ],
  exports: [DossiersService],
})
export class DossiersModule {}
