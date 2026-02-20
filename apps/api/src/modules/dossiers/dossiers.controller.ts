// apps/api/src/modules/dossiers/dossiers.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { User } from '@prisma/client';
import {
  DossierResponse,
  DossiersListResponse,
} from '@aidesmax/shared';
import { DossiersService } from './dossiers.service';
import { CreateDossierDto, UpdateDossierDto, DossierFiltersDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * Contrôleur Dossiers
 * 
 * Gère les dossiers de demande d'aide des utilisateurs.
 * Tous les endpoints nécessitent une authentification JWT.
 * 
 * Endpoints:
 * - POST /api/dossiers - Créer un dossier
 * - GET /api/dossiers - Lister ses dossiers
 * - GET /api/dossiers/:id - Détail d'un dossier
 * - PUT /api/dossiers/:id - Mettre à jour un dossier
 */
@Controller('dossiers')
@UseGuards(JwtAuthGuard)
export class DossiersController {
  constructor(private readonly dossiersService: DossiersService) {}

  /**
   * POST /api/dossiers
   * 
   * Créer un nouveau dossier de demande d'aide
   * 
   * Le dossier sera pré-rempli avec les données du profil de l'utilisateur.
   * Un document de demande sera automatiquement généré.
   * 
   * @param userId - ID de l'utilisateur (extrait du JWT)
   * @param dto - Données de création (aidId obligatoire)
   * @returns Le dossier créé avec son contenu généré
   * 
   * @status 201 - Dossier créé
   * @status 400 - Validation échouée ou aide inactive
   * @status 401 - Non authentifié
   * @status 404 - Aide non trouvée ou profil manquant
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateDossierDto,
  ): Promise<DossierResponse> {
    const dossier = await this.dossiersService.createDossier(userId, dto);
    return { dossier };
  }

  /**
   * GET /api/dossiers
   * 
   * Lister les dossiers de l'utilisateur connecté
   * 
   * @param userId - ID de l'utilisateur (extrait du JWT)
   * @param filters - Filtres et pagination
   * @returns Liste paginée des dossiers
   * 
   * @status 200 - Succès
   * @status 401 - Non authentifié
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() filters: DossierFiltersDto,
  ): Promise<DossiersListResponse> {
    return this.dossiersService.findAllForUser(userId, filters);
  }

  /**
   * GET /api/dossiers/:id
   * 
   * Récupérer le détail d'un dossier
   * 
   * L'utilisateur ne peut accéder qu'à ses propres dossiers,
   * sauf s'il est administrateur.
   * 
   * @param user - Utilisateur (extrait du JWT)
   * @param id - ID du dossier
   * @returns Le dossier complet
   * 
   * @status 200 - Dossier trouvé
   * @status 401 - Non authentifié
   * @status 403 - Accès refusé (dossier d'un autre utilisateur)
   * @status 404 - Dossier non trouvé
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<DossierResponse> {
    const dossier = await this.dossiersService.findOneForUser(user, id);
    return { dossier };
  }

  /**
   * PUT /api/dossiers/:id
   * 
   * Mettre à jour un dossier
   * 
   * Permet de modifier :
   * - Le statut (avec validation des transitions autorisées)
   * - Les données du formulaire
   * - Les notes personnelles
   * 
   * Transitions de statut autorisées pour les utilisateurs :
   * - BROUILLON → PRET, ANNULE
   * - PRET → BROUILLON, SOUMIS, ANNULE
   * - SOUMIS → ANNULE
   * 
   * @param user - Utilisateur (extrait du JWT)
   * @param id - ID du dossier
   * @param dto - Données de mise à jour
   * @returns Le dossier mis à jour
   * 
   * @status 200 - Dossier mis à jour
   * @status 400 - Validation échouée ou transition non autorisée
   * @status 401 - Non authentifié
   * @status 403 - Accès refusé
   * @status 404 - Dossier non trouvé
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateDossierDto,
  ): Promise<DossierResponse> {
    const dossier = await this.dossiersService.updateDossier(user, id, dto);
    return { dossier };
  }
}
