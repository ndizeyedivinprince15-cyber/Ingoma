// apps/api/src/modules/profile/profile.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ProfileResponse } from '@aidesmax/shared';
import { ProfileService } from './profile.service';
import { CreateUpdateProfileDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * Contrôleur Profile
 * 
 * Gère le profil d'éligibilité de l'utilisateur connecté.
 * Tous les endpoints nécessitent une authentification JWT.
 * 
 * Endpoints:
 * - POST /api/profile - Créer ou mettre à jour le profil
 * - GET /api/profile - Récupérer le profil
 */
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * POST /api/profile
   * 
   * Créer ou mettre à jour le profil d'éligibilité de l'utilisateur connecté
   * 
   * @param userId - ID de l'utilisateur (extrait du JWT)
   * @param dto - Données du profil (réponses au questionnaire)
   * @param res - Objet Response Express pour gérer le status code dynamique
   * @returns ProfileResponse avec le profil créé/mis à jour
   * 
   * @status 201 - Profil créé (nouvelle création)
   * @status 200 - Profil mis à jour (existait déjà)
   * @status 400 - Validation échouée
   * @status 401 - Non authentifié
   */
  @Post()
  async createOrUpdateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateUpdateProfileDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ProfileResponse> {
    const { profile, created } = await this.profileService.upsertProfileForUser(
      userId,
      dto,
    );

    // Définir le status code selon qu'il s'agit d'une création ou mise à jour
    res.status(created ? HttpStatus.CREATED : HttpStatus.OK);

    return { profile };
  }

  /**
   * GET /api/profile
   * 
   * Récupérer le profil d'éligibilité de l'utilisateur connecté
   * 
   * @param userId - ID de l'utilisateur (extrait du JWT)
   * @returns ProfileResponse avec le profil
   * 
   * @status 200 - Profil trouvé
   * @status 401 - Non authentifié
   * @status 404 - Aucun profil pour cet utilisateur
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProfile(
    @CurrentUser('id') userId: string,
  ): Promise<ProfileResponse> {
    const profile = await this.profileService.getProfileForUser(userId);

    if (!profile) {
      throw new NotFoundException(
        'Aucun profil trouvé. Veuillez compléter le questionnaire.',
      );
    }

    return { profile };
  }
}
