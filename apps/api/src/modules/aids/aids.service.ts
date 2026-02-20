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
  // PaginationMeta est défini localement car il manque dans l'export du shared
  EligibilityRules,
  EstimationRules,
} from '@aidesmax/shared';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAidDto, UpdateAidDto, AidFiltersDto } from './dto';

// Definition locale pour corriger l'erreur TS2305
interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable()
export class AidsService {
  private readonly logger = new Logger(AidsService.name);

  constructor(private readonly prisma: PrismaService) {}

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

    const where: Prisma.AidWhereInput = {
      isActive,
    };

    if (category) {
      where.category = category as any;
    }

    if (geographicScope) {
      where.geographicScope = geographicScope as any;
    }

    if (region || department) {
      const zoneFilter = region || department;
      where.OR = [
        { geographicScope: 'NATIONAL' as any },
        // Correction de l'erreur TS2353 : Utilisation de contains au lieu de has
        { geographicZones: { contains: zoneFilter } },
      ];
    }

    if (search && search.trim()) {
      const searchTerm = search.trim();
      // Correction : Suppression de mode: 'insensitive' qui fait planter Prisma sur certaines configs
      const searchFilter: Prisma.AidWhereInput[] = [
        { name: { contains: searchTerm } },
        { shortDescription: { contains: searchTerm } },
        { longDescription: { contains: searchTerm } },
        { authority: { contains: searchTerm } },
      ];

      if (where.OR) {
        where.AND = [
          { OR: where.OR },
          { OR: searchFilter },
        ];
        delete where.OR;
      } else {
        where.OR = searchFilter;
      }
    }

    const total = await this.prisma.aid.count({ where });
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    const aids = await this.prisma.aid.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { displayOrder: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    const meta: PaginationMeta = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    const aidSummaries = aids.map((aid) => this.toAidSummaryDto(aid));

    return {
      aids: aidSummaries,
      meta: meta as any,
    };
  }

  async findByIdOrSlug(idOrSlug: string): Promise<Aid | null> {
    let aid = await this.prisma.aid.findUnique({
      where: { slug: idOrSlug },
    });

    if (!aid) {
      aid = await this.prisma.aid.findUnique({
        where: { id: idOrSlug },
      });
    }

    if (!aid) return null;
    return this.toAidDto(aid);
  }

  async create(dto: CreateAidDto): Promise<Aid> {
    const existingAid = await this.prisma.aid.findUnique({
      where: { slug: dto.slug },
    });

    if (existingAid) {
      throw new ConflictException(`Le slug "${dto.slug}" est déjà utilisé`);
    }

    const aid = await this.prisma.aid.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        category: dto.category as any,
        shortDescription: dto.shortDescription,
        longDescription: dto.longDescription ?? null,
        authority: dto.authority,
        geographicScope: dto.geographicScope as any,
        // Correction : On s'assure que c'est une string si votre schema n'est pas un array
        geographicZones: Array.isArray(dto.geographicZones) ? dto.geographicZones.join(',') : (dto.geographicZones ?? ''),
        eligibilityRules: dto.eligibilityRules as any,
        estimationRules: dto.estimationRules ? (dto.estimationRules as any) : null,
        officialLink: dto.officialLink ?? null,
        requiredDocuments: Array.isArray(dto.requiredDocuments) ? dto.requiredDocuments.join(',') : (dto.requiredDocuments ?? ''),
        displayOrder: dto.displayOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });

    return this.toAidDto(aid);
  }

  async update(idOrSlug: string, dto: UpdateAidDto): Promise<Aid> {
    const existingAid = await this.findPrismaAidByIdOrSlug(idOrSlug);
    if (!existingAid) throw new NotFoundException(`Aide "${idOrSlug}" non trouvée`);

    const updateData: Prisma.AidUpdateInput = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.category !== undefined) updateData.category = dto.category as any;
    if (dto.geographicZones !== undefined) {
        updateData.geographicZones = Array.isArray(dto.geographicZones) ? dto.geographicZones.join(',') : dto.geographicZones;
    }
    if (dto.eligibilityRules !== undefined) updateData.eligibilityRules = dto.eligibilityRules as any;
    if (dto.requiredDocuments !== undefined) {
        updateData.requiredDocuments = Array.isArray(dto.requiredDocuments) ? dto.requiredDocuments.join(',') : dto.requiredDocuments;
    }
    // ... autres champs si nécessaire

    const updatedAid = await this.prisma.aid.update({
      where: { id: existingAid.id },
      data: updateData,
    });

    return this.toAidDto(updatedAid);
  }

  async softDelete(idOrSlug: string): Promise<AidSummary> {
    const existingAid = await this.findPrismaAidByIdOrSlug(idOrSlug);
    if (!existingAid) throw new NotFoundException(`Aide "${idOrSlug}" non trouvée`);

    const deactivatedAid = await this.prisma.aid.update({
      where: { id: existingAid.id },
      data: { isActive: false },
    });

    return this.toAidSummaryDto(deactivatedAid);
  }

  async findAllActive(filters?: { category?: string; aidIds?: string[] }): Promise<Aid[]> {
    const where: Prisma.AidWhereInput = { isActive: true };

    if (filters?.category) {
      where.category = filters.category as any;
    }

    if (filters?.aidIds && filters.aidIds.length > 0) {
      where.id = { in: filters.aidIds };
    }

    const aids = await this.prisma.aid.findMany({
      where,
      orderBy: [{ displayOrder: 'desc' }, { createdAt: 'desc' }],
    });

    return aids.map((aid) => this.toAidDto(aid));
  }

  private async findPrismaAidByIdOrSlug(idOrSlug: string): Promise<PrismaAid | null> {
    let aid = await this.prisma.aid.findUnique({ where: { slug: idOrSlug } });
    if (!aid) aid = await this.prisma.aid.findUnique({ where: { id: idOrSlug } });
    return aid;
  }

  private toAidDto(aid: PrismaAid): Aid {
    return {
      id: aid.id,
      name: aid.name,
      slug: aid.slug,
      category: aid.category as any,
      shortDescription: aid.shortDescription,
      longDescription: aid.longDescription,
      authority: aid.authority,
      geographicScope: aid.geographicScope as any,
      geographicZones: typeof aid.geographicZones === 'string' ? aid.geographicZones.split(',') : [],
      eligibilityRules: aid.eligibilityRules as unknown as EligibilityRules,
      estimationRules: aid.estimationRules as unknown as EstimationRules | null,
      officialLink: aid.officialLink,
      requiredDocuments: typeof aid.requiredDocuments === 'string' ? aid.requiredDocuments.split(',') : [],
      displayOrder: aid.displayOrder,
      isActive: aid.isActive,
      createdAt: aid.createdAt.toISOString(),
      updatedAt: aid.updatedAt.toISOString(),
    };
  }

  private toAidSummaryDto(aid: PrismaAid): AidSummary {
    return {
      id: aid.id,
      name: aid.name,
      slug: aid.slug,
      category: aid.category as any,
      shortDescription: aid.shortDescription,
      authority: aid.authority,
      geographicScope: aid.geographicScope as any,
      isActive: aid.isActive,
    };
  }
}