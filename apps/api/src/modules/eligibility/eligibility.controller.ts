// apps/api/src/modules/eligibility/eligibility.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { EligibilityEvaluationResponse } from '@aidesmax/shared';
import { EligibilityService } from './eligibility.service';
import { EvaluateEligibilityDto } from './dto';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * Contrôleur Eligibility
 * 
 * Expose l'endpoint d'évaluation d'éligibilité.
 * Supporte les modes anonyme et connecté.
 * 
 * Endpoints:
 * - POST /api/eligibility/evaluate - Évaluer l'éligibilité aux aides
 */
@Controller('eligibility')
export class EligibilityController {
  constructor(private readonly eligibilityService: EligibilityService) {}

  /**
   * POST /api/eligibility/evaluate
   * 
   * Évalue l'éligibilité d'un profil pour toutes les aides actives.
   * 
   * Modes de fonctionnement :
   * 
   * 1. Mode ANONYME (sans token JWT) :
   *    - profileData obligatoire dans le body
   *    - Pas de persistance des résultats
   * 
   * 2. Mode CONNECTÉ (avec token JWT) :
   *    - Si profileData fourni : évaluation directe, pas de persistance
   *    - Sinon : utilise le profil stocké, persistance par défaut
   *    - persistResults: false pour désactiver la persistance
   * 
   * @param dto - Options d'évaluation (profileData, filtres, etc.)
   * @param user - Utilisateur connecté (null si anonyme)
   * @returns Résultats d'éligibilité pour toutes les aides
   * 
   * @status 200 - Évaluation réussie
   * @status 400 - Aucune donnée de profil fournie (mode anonyme sans profileData)
   * @status 404 - Profil non trouvé (profileId inconnu ou utilisateur sans profil)
   */
  @Post('evaluate')
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async evaluate(
    @Body() dto: EvaluateEligibilityDto,
    @CurrentUser() user: User | null,
  ): Promise<EligibilityEvaluationResponse> {
    const userId = user?.id ?? null;
    return this.eligibilityService.evaluateAndMaybePersist(userId, dto);
  }
}
