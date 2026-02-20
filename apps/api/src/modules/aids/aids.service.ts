// apps/api/src/modules/aids/aids.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Aid as PrismaAid, Prisma } from '@prisma/client';
import {
  Aid,
  AidSummary,
  AidsListResponse,
  PaginationMeta,
  EligibilityRules,
  EstimationRules,
} from '@aidesmax/shared';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAidDto, UpdateAidDto, AidFiltersDto } from './dto';

/**
 * Service Aids
 * 
 * Gère toutes les opérations CRUD sur les aides.
 * Utilisé par le controller pour les endpoints publics et admin.
 */
@Injectable()
export class AidsService {
  private readonly logger = new Logger(AidsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupérer la liste des aides avec filtres et pagination
   * 
   * @param filtersDto - Filtres de recherche et pagination
   * @returns Liste paginée des aides (résumés)
   */
  async findAll(filtersDto: AidFiltersDto): Promise<AidsListResponse> {
    const {
      page = 1,
      limit = 20,
      category,
      geographicScope,
      region,
      department,
      isActive = true,
      search,
    } = filtersDto;

    // Construction du where clause
    const where: Prisma.AidWhereInput = {
      // Filtre sur isActive (par défaut true)
      isActive,
    };

    // Filtre par catégorie
    if (category) {
      where.category = category;
    }

    // Filtre par portée géographique
    if (geographicScope) {
      where.geographicScope = geographicScope;
    }

    // Filtre par région ou département
    // Logique : on retourne les aides NATIONAL + celles dont geographicZones contient la région/département
    if (region || department) {
      const zoneFilter = region || department;
      where.OR = [
        { geographicScope: 'NATIONAL' },
        { geographicZones: { has: zoneFilter } },
      ];
    }

    // Recherche textuelle
    if (search && search.trim()) {
      const searchTerm = search.trim();
      const searchFilter: Prisma.AidWhereInput[] = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { shortDescription: { contains: searchTerm, mode: 'insensitive' } },
        { longDescription: { contains: searchTerm, mode: 'insensitive' } },
        { authority: { contains: searchTerm, mode: 'insensitive' } },
      ];

      // Combiner avec les filtres existants
      if (where.OR) {
        // Si on a déjà un OR (pour région/département), on doit combiner avec AND
        where.AND = [
          { OR: where.OR },
          { OR: searchFilter },
        ];
        delete where.OR;
      } else {
        where.OR = searchFilter;
      }
    }

    // Compter le total
    const total = await this.prisma.aid.count({ where });

    // Calculer la pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Récupérer les aides
    const aids = await this.prisma.aid.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { displayOrder: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Construire les métadonnées de pagination
    const meta: PaginationMeta = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    // Mapper vers les résumés
    const aidSummaries = aids.map((aid) => this.toAidSummaryDto(aid));

    return {
      aids: aidSummaries,
      meta,
    };
  }

  /**
   * Trouver une aide par son ID ou son slug
   * 
   * Stratégie :
   * 1. Essayer par slug
   * 2. Si non trouvé, essayer par id
   * 
   * @param idOrSlug - ID ou slug de l'aide
   * @returns L'aide complète ou null
   */
  async findByIdOrSlug(idOrSlug: string): Promise<Aid | null> {
    // Essayer d'abord par slug
    let aid = await this.prisma.aid.findUnique({
      where: { slug: idOrSlug },
    });

    // Si non trouvé, essayer par id
    if (!aid) {
      aid = await this.prisma.aid.findUnique({
        where: { id: idOrSlug },
      });
    }

    if (!aid) {
      return null;
    }

    return this.toAidDto(aid);
  }

  /**
   * Créer une nouvelle aide
   * 
   * @param dto - Données de l'aide à créer
   * @returns L'aide créée
   * @throws ConflictException si le slug existe déjà
   */
  async create(dto: CreateAidDto): Promise<Aid> {
    // Vérifier l'unicité du slug
    const existingAid = await this.prisma.aid.findUnique({
      where: { slug: dto.slug },
    });

    if (existingAid) {
      throw new ConflictException(`Le slug "${dto.slug}" est déjà utilisé`);
    }

    // Créer l'aide
    const aid = await this.prisma.aid.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        category: dto.category,
        shortDescription: dto.shortDescription,
        longDescription: dto.longDescription ?? null,
        authority: dto.authority,
        geographicScope: dto.geographicScope,
        geographicZones: dto.geographicZones ?? [],
        eligibilityRules: dto.eligibilityRules as object,
        estimationRules: dto.estimationRules ? (dto.estimationRules as object) : null,
        officialLink: dto.officialLink ?? null,
        requiredDocuments: dto.requiredDocuments ?? [],
        displayOrder: dto.displayOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });

    this.logger.log(`Aide créée : "${aid.name}" (${aid.slug})`);

    return this.toAidDto(aid);
  }

  /**
   * Mettre à jour une aide existante
   * 
   * @param idOrSlug - ID ou slug de l'aide à mettre à jour
   * @param dto - Données à mettre à jour
   * @returns L'aide mise à jour
   * @throws NotFoundException si l'aide n'existe pas
   * @throws ConflictException si le nouveau slug existe déjà
   */
  async update(idOrSlug: string, dto: UpdateAidDto): Promise<Aid> {
    // Trouver l'aide existante
    const existingAid = await this.findPrismaAidByIdOrSlug(idOrSlug);

    if (!existingAid) {
      throw new NotFoundException(`Aide "${idOrSlug}" non trouvée`);
    }

    // Vérifier l'unicité du nouveau slug (si modifié)
    if (dto.slug && dto.slug !== existingAid.slug) {
      const slugExists = await this.prisma.aid.findUnique({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new ConflictException(`Le slug "${dto.slug}" est déjà utilisé`);
      }
    }

    // Préparer les données de mise à jour
    const updateData: Prisma.AidUpdateInput = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.slug !== undefined) updateData.slug = dto.slug;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.shortDescription !== undefined) updateData.shortDescription = dto.shortDescription;
    if (dto.longDescription !== undefined) updateData.longDescription = dto.longDescription;
    if (dto.authority !== undefined) updateData.authority = dto.authority;
    if (dto.geographicScope !== undefined) updateData.geographicScope = dto.geographicScope;
    if (dto.geographicZones !== undefined) updateData.geographicZones = dto.geographicZones;
    if (dto.eligibilityRules !== undefined) updateData.eligibilityRules = dto.eligibilityRules as object;
    if (dto.estimationRules !== undefined) updateData.estimationRules = dto.estimationRules as object;
    if (dto.officialLink !== undefined) updateData.officialLink = dto.officialLink;
    if (dto.requiredDocuments !== undefined) updateData.requiredDocuments = dto.requiredDocuments;
    if (dto.displayOrder !== undefined) updateData.displayOrder = dto.displayOrder;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    // Mettre à jour
    const updatedAid = await this.prisma.aid.update({
      where: { id: existingAid.id },
      data: updateData,
    });

    this.logger.log(`Aide mise à jour : "${updatedAid.name}" (${updatedAid.slug})`);

    return this.toAidDto(updatedAid);
  }

  /**
   * Désactiver une aide (soft delete)
   * 
   * @param idOrSlug - ID ou slug de l'aide à désactiver
   * @returns L'aide désactivée
   * @throws NotFoundException si l'aide n'existe pas
   */
  async softDelete(idOrSlug: string): Promise<AidSummary> {
    // Trouver l'aide existante
    const existingAid = await this.findPrismaAidByIdOrSlug(idOrSlug);

    if (!existingAid) {
      throw new NotFoundException(`Aide "${idOrSlug}" non trouvée`);
    }

    // Désactiver l'aide
    const deactivatedAid = await this.prisma.aid.update({
      where: { id: existingAid.id },
      data: { isActive: false },
    });

    this.logger.log(`Aide désactivée : "${deactivatedAid.name}" (${deactivatedAid.slug})`);

    return this.toAidSummaryDto(deactivatedAid);
  }

  /**
   * Récupérer toutes les aides actives (sans pagination)
   * Utilisé par le moteur d'éligibilité
   * 
   * @param filters - Filtres optionnels
   * @returns Liste de toutes les aides actives
   */
  async findAllActive(filters?: {
    category?: string;
    aidIds?: string[];
  }): Promise<Aid[]> {
    const where: Prisma.AidWhereInput = {
      isActive: true,
    };

    if (filters?.category) {
      where.category = filters.category as Prisma.EnumAidCategoryFilter;
    }

    if (filters?.aidIds && filters.aidIds.length > 0) {
      where.id = { in: filters.aidIds };
    }

    const aids = await this.prisma.aid.findMany({
      where,
      orderBy: [
        { displayOrder: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return aids.map((aid) => this.toAidDto(aid));
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MÉTHODES PRIVÉES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Trouver une aide Prisma par ID ou slug
   */
  private async findPrismaAidByIdOrSlug(idOrSlug: string): Promise<PrismaAid | null> {
    // Essayer d'abord par slug
    let aid = await this.prisma.aid.findUnique({
      where: { slug: idOrSlug },
    });

    // Si non trouvé, essayer par id
    if (!aid) {
      aid = await this.prisma.aid.findUnique({
        where: { id: idOrSlug },
      });
    }

    return aid;
  }

  /**
   * Convertir une entité Prisma Aid en DTO Aid complet
   */
  private toAidDto(aid: PrismaAid): Aid {
    return {
      id: aid.id,
      name: aid.name,
      slug: aid.slug,
      category: aid.category,
      shortDescription: aid.shortDescription,
      longDescription: aid.longDescription,
      authority: aid.authority,
      geographicScope: aid.geographicScope,
      geographicZones: aid.geographicZones,
      eligibilityRules: aid.eligibilityRules as EligibilityRules,
      estimationRules: aid.estimationRules as EstimationRules | null,
      officialLink: aid.officialLink,
      requiredDocuments: aid.requiredDocuments,
      displayOrder: aid.displayOrder,
      isActive: aid.isActive,
      createdAt: aid.createdAt.toISOString(),
      updatedAt: aid.updatedAt.toISOString(),
    };
  }

  /**
   * Convertir une entité Prisma Aid en DTO AidSummary (résumé)
   */
  private toAidSummaryDto(aid: PrismaAid): AidSummary {
    return {
      id: aid.id,
      name: aid.name,
      slug: aid.slug,
      category: aid.category,
      shortDescription: aid.shortDescription,
      authority: aid.authority,
      geographicScope: aid.geographicScope,
      isActive: aid.isActive,
    };
  }
}
