// apps/api/src/modules/aids/aids.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  AidsListResponse,
  AidDetailResponse,
  AidSummary,
  UserRole,
} from '@aidesmax/shared';
import { AidsService } from './aids.service';
import { CreateAidDto, UpdateAidDto, AidFiltersDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

/**
 * Réponse pour la suppression (soft delete) d'une aide
 */
interface DeleteAidResponse {
  message: string;
  aid: AidSummary;
}

/**
 * Contrôleur Aids
 * 
 * Gère le catalogue des aides et subventions.
 * 
 * Endpoints publics:
 * - GET /api/aids - Liste paginée avec filtres
 * - GET /api/aids/:idOrSlug - Détail d'une aide
 * 
 * Endpoints admin (JWT + rôle ADMIN):
 * - POST /api/aids - Créer une aide
 * - PUT /api/aids/:idOrSlug - Mettre à jour une aide
 * - DELETE /api/aids/:idOrSlug - Désactiver une aide
 */
@Controller('aids')
export class AidsController {
  constructor(private readonly aidsService: AidsService) {}

  // ═══════════════════════════════════════════════════════════════════════
  // ENDPOINTS PUBLICS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * GET /api/aids
   * 
   * Liste paginée des aides avec filtres
   * 
   * @param filters - Paramètres de filtrage et pagination
   * @returns Liste des aides avec métadonnées de pagination
   * 
   * @status 200 - Succès
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: AidFiltersDto): Promise<AidsListResponse> {
    return this.aidsService.findAll(filters);
  }

  /**
   * GET /api/aids/:idOrSlug
   * 
   * Détail d'une aide par son ID ou son slug
   * 
   * @param idOrSlug - ID (cuid) ou slug de l'aide
   * @returns Détail complet de l'aide
   * 
   * @status 200 - Aide trouvée
   * @status 404 - Aide non trouvée
   */
  @Get(':idOrSlug')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('idOrSlug') idOrSlug: string): Promise<AidDetailResponse> {
    const aid = await this.aidsService.findByIdOrSlug(idOrSlug);

    if (!aid) {
      throw new NotFoundException(`Aide "${idOrSlug}" non trouvée`);
    }

    return { aid };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ENDPOINTS ADMIN
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * POST /api/aids
   * 
   * Créer une nouvelle aide (admin uniquement)
   * 
   * @param createAidDto - Données de l'aide à créer
   * @returns L'aide créée
   * 
   * @status 201 - Aide créée
   * @status 400 - Validation échouée
   * @status 401 - Non authentifié
   * @status 403 - Non autorisé (pas admin)
   * @status 409 - Slug déjà utilisé
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAidDto: CreateAidDto): Promise<AidDetailResponse> {
    const aid = await this.aidsService.create(createAidDto);
    return { aid };
  }

  /**
   * PUT /api/aids/:idOrSlug
   * 
   * Mettre à jour une aide existante (admin uniquement)
   * 
   * @param idOrSlug - ID ou slug de l'aide
   * @param updateAidDto - Données à mettre à jour
   * @returns L'aide mise à jour
   * 
   * @status 200 - Aide mise à jour
   * @status 400 - Validation échouée
   * @status 401 - Non authentifié
   * @status 403 - Non autorisé (pas admin)
   * @status 404 - Aide non trouvée
   * @status 409 - Nouveau slug déjà utilisé
   */
  @Put(':idOrSlug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('idOrSlug') idOrSlug: string,
    @Body() updateAidDto: UpdateAidDto,
  ): Promise<AidDetailResponse> {
    const aid = await this.aidsService.update(idOrSlug, updateAidDto);
    return { aid };
  }

  /**
   * DELETE /api/aids/:idOrSlug
   * 
   * Désactiver une aide (soft delete, admin uniquement)
   * 
   * L'aide n'est pas supprimée physiquement, seulement désactivée (isActive = false).
   * Les dossiers existants liés à cette aide ne sont pas affectés.
   * 
   * @param idOrSlug - ID ou slug de l'aide
   * @returns Message de confirmation et résumé de l'aide désactivée
   * 
   * @status 200 - Aide désactivée
   * @status 401 - Non authentifié
   * @status 403 - Non autorisé (pas admin)
   * @status 404 - Aide non trouvée
   */
  @Delete(':idOrSlug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('idOrSlug') idOrSlug: string): Promise<DeleteAidResponse> {
    const aid = await this.aidsService.softDelete(idOrSlug);
    return {
      message: 'Aide désactivée avec succès',
      aid,
    };
  }
}
