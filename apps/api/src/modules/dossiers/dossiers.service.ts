// apps/api/src/modules/dossiers/dossiers.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { User, Dossier as PrismaDossier, Aid as PrismaAid } from '@prisma/client';
import { Prisma } from '@prisma/client';
import {
  Dossier,
  DossierSummary,
  DossiersListResponse,
  DossierFormData,
  DossierStatus,
  AidSummary,
  AidCategory,
  PaginationMeta,
  UserProfile,
} from '@aidesmax/shared';
import { PrismaService } from '../prisma/prisma.service';
import { AidsService } from '../aids/aids.service';
import { ProfileService } from '../profile/profile.service';
import { DocumentGeneratorService } from './document-generator.service';
import { CreateDossierDto, UpdateDossierDto, DossierFiltersDto } from './dto';

/**
 * Type Prisma Dossier avec relation Aid incluse
 */
type DossierWithAid = PrismaDossier & { aid: PrismaAid };

/**
 * Transitions de statut autorisées pour les utilisateurs standard
 */
const USER_STATUS_TRANSITIONS: Record<DossierStatus, DossierStatus[]> = {
  BROUILLON: ['PRET', 'ANNULE'],
  PRET: ['BROUILLON', 'SOUMIS', 'ANNULE'],
  SOUMIS: ['ANNULE'],
  EN_COURS: [],
  ACCEPTE: [],
  REFUSE: [],
  ANNULE: [],
};

/**
 * Transitions de statut autorisées pour les administrateurs
 */
const ADMIN_STATUS_TRANSITIONS: Record<DossierStatus, DossierStatus[]> = {
  BROUILLON: ['PRET', 'ANNULE'],
  PRET: ['BROUILLON', 'SOUMIS', 'ANNULE'],
  SOUMIS: ['EN_COURS', 'ACCEPTE', 'REFUSE', 'ANNULE'],
  EN_COURS: ['ACCEPTE', 'REFUSE', 'ANNULE'],
  ACCEPTE: [],
  REFUSE: [],
  ANNULE: [],
};

/**
 * Service Dossiers
 * 
 * Gère toutes les opérations CRUD sur les dossiers de demande d'aide.
 */
@Injectable()
export class DossiersService {
  private readonly logger = new Logger(DossiersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aidsService: AidsService,
    private readonly profileService: ProfileService,
    private readonly documentGenerator: DocumentGeneratorService,
  ) {}

  /**
   * Créer un nouveau dossier pour une aide
   * 
   * @param userId - ID de l'utilisateur
   * @param dto - Données de création
   * @returns Le dossier créé
   */
  async createDossier(userId: string, dto: CreateDossierDto): Promise<Dossier> {
    // 1. Récupérer l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // 2. Vérifier que l'aide existe
    const aid = await this.prisma.aid.findUnique({
      where: { id: dto.aidId },
    });

    if (!aid) {
      throw new NotFoundException(`Aide "${dto.aidId}" non trouvée`);
    }

    if (!aid.isActive) {
      throw new BadRequestException('Cette aide n\'est plus disponible');
    }

    // 3. Récupérer le profil de l'utilisateur
    const profile = await this.profileService.getProfileForUser(userId);

    if (!profile) {
      throw new NotFoundException(
        'Aucun profil trouvé. Veuillez compléter le questionnaire avant de créer un dossier.',
      );
    }

    // 4. Construire le formData initial pré-rempli
    const prefilledFormData = this.buildPrefilledFormData(user, profile, dto.formData);

    // 5. Construire le résumé de l'aide pour le générateur
    const aidSummary: AidSummary = {
      id: aid.id,
      name: aid.name,
      slug: aid.slug,
      category: aid.category,
      shortDescription: aid.shortDescription,
      authority: aid.authority,
      geographicScope: aid.geographicScope,
      isActive: aid.isActive,
    };

    // 6. Générer le contenu du document
    const generatedContent = this.documentGenerator.generateDossierContent({
      user,
      profile,
      aid: aidSummary,
      formData: prefilledFormData,
    });

    // 7. Créer le dossier en base
    const dossier = await this.prisma.dossier.create({
      data: {
        userId,
        aidId: dto.aidId,
        status: 'BROUILLON',
        formData: prefilledFormData as unknown as Prisma.InputJsonValue,
        generatedContent,
        userNotes: dto.userNotes ?? null,
      },
      include: { aid: true },
    });

    this.logger.log(
      `Dossier créé : ${dossier.id} pour l'aide "${aid.name}" par l'utilisateur ${userId}`,
    );

    return this.toDossierDto(dossier);
  }

  /**
   * Lister les dossiers d'un utilisateur avec filtres et pagination
   * 
   * @param userId - ID de l'utilisateur
   * @param filters - Filtres et pagination
   * @returns Liste paginée des dossiers
   */
  async findAllForUser(
    userId: string,
    filters: DossierFiltersDto,
  ): Promise<DossiersListResponse> {
    const { page = 1, limit = 20, status, aidCategory } = filters;

    // Construire le where clause
    const where: Prisma.DossierWhereInput = {
      userId,
    };

    if (status) {
      where.status = status;
    }

    if (aidCategory) {
      where.aid = { category: aidCategory };
    }

    // Compter le total
    const total = await this.prisma.dossier.count({ where });

    // Calculer la pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Récupérer les dossiers
    const dossiers = await this.prisma.dossier.findMany({
      where,
      include: { aid: true },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
    });

    // Construire les métadonnées
    const meta: PaginationMeta = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    // Mapper vers les résumés
    const dossierSummaries = dossiers.map((d) => this.toDossierSummaryDto(d));

    return {
      dossiers: dossierSummaries,
      meta,
    };
  }

  /**
   * Récupérer un dossier par son ID
   * 
   * @param user - Utilisateur qui fait la requête
   * @param dossierId - ID du dossier
   * @returns Le dossier complet
   */
  async findOneForUser(user: User, dossierId: string): Promise<Dossier> {
    // Récupérer le dossier avec l'aide
    const dossier = await this.prisma.dossier.findUnique({
      where: { id: dossierId },
      include: { aid: true },
    });

    if (!dossier) {
      throw new NotFoundException(`Dossier "${dossierId}" non trouvé`);
    }

    // Vérifier l'accès
    this.checkAccess(user, dossier);

    return this.toDossierDto(dossier);
  }

  /**
   * Mettre à jour un dossier
   * 
   * @param user - Utilisateur qui fait la requête
   * @param dossierId - ID du dossier
   * @param dto - Données de mise à jour
   * @returns Le dossier mis à jour
   */
  async updateDossier(
    user: User,
    dossierId: string,
    dto: UpdateDossierDto,
  ): Promise<Dossier> {
    // 1. Récupérer le dossier existant
    const existingDossier = await this.prisma.dossier.findUnique({
      where: { id: dossierId },
      include: { aid: true },
    });

    if (!existingDossier) {
      throw new NotFoundException(`Dossier "${dossierId}" non trouvé`);
    }

    // 2. Vérifier l'accès
    this.checkAccess(user, existingDossier);

    // 3. Préparer les données de mise à jour
    const updateData: Prisma.DossierUpdateInput = {};

    // 4. Gérer la transition de statut
    if (dto.status && dto.status !== existingDossier.status) {
      const isAdmin = user.role === 'ADMIN';
      
      if (!this.canTransition(existingDossier.status as DossierStatus, dto.status, isAdmin)) {
        throw new BadRequestException(
          `Transition de statut non autorisée : ${existingDossier.status} → ${dto.status}`,
        );
      }

      updateData.status = dto.status;

      // Si passage à SOUMIS, définir la date de soumission
      if (dto.status === 'SOUMIS' && !existingDossier.submittedAt) {
        updateData.submittedAt = new Date();
      }

      this.logger.log(
        `Transition de statut pour dossier ${dossierId} : ${existingDossier.status} → ${dto.status}`,
      );
    }

    // 5. Gérer la mise à jour du formData
    if (dto.formData) {
      const existingFormData = existingDossier.formData as unknown as DossierFormData;
      const mergedFormData = this.mergeFormData(existingFormData, dto.formData);
      updateData.formData = mergedFormData as unknown as Prisma.InputJsonValue;
    }

    // 6. Gérer les notes utilisateur
    if (dto.userNotes !== undefined) {
      updateData.userNotes = dto.userNotes;
    }

    // 7. Optionnel : régénérer le contenu si le formData a changé
    // Pour le MVP, on laisse le contenu original
    // TODO: Régénérer le document si nécessaire

    // 8. Mettre à jour le dossier
    const updatedDossier = await this.prisma.dossier.update({
      where: { id: dossierId },
      data: updateData,
      include: { aid: true },
    });

    this.logger.log(`Dossier mis à jour : ${dossierId}`);

    return this.toDossierDto(updatedDossier);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MÉTHODES PRIVÉES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Construire le formData pré-rempli depuis le profil
   */
  private buildPrefilledFormData(
    user: User,
    profile: UserProfile,
    providedFormData?: Partial<DossierFormData>,
  ): DossierFormData {
    // Données pré-remplies par défaut
    const prefilled: DossierFormData = {
      personalInfo: {
        fullName: providedFormData?.personalInfo?.fullName || '',
        birthDate: providedFormData?.personalInfo?.birthDate || '',
        address: providedFormData?.personalInfo?.address || '',
        phone: providedFormData?.personalInfo?.phone || '',
        email: user.email,
      },
      aidSpecificData: {
        age: profile.age,
        professionalStatus: profile.professionalStatus,
        familyStatus: profile.familyStatus,
        childrenCount: profile.childrenCount,
        annualIncome: profile.annualIncome,
        postalCode: profile.postalCode,
        department: profile.department,
        region: profile.region,
        housingType: profile.housingType,
        housingStatus: profile.housingStatus,
        housingConstructionYear: profile.housingConstructionYear,
        hasRenovationProject: profile.hasRenovationProject,
        hasBusinessProject: profile.hasBusinessProject,
        isStudent: profile.isStudent,
      },
      declaredDocuments: providedFormData?.declaredDocuments || [],
    };

    // Fusionner avec les données fournies
    if (providedFormData) {
      if (providedFormData.personalInfo) {
        prefilled.personalInfo = {
          ...prefilled.personalInfo,
          ...providedFormData.personalInfo,
        };
      }
      if (providedFormData.aidSpecificData) {
        prefilled.aidSpecificData = {
          ...prefilled.aidSpecificData,
          ...providedFormData.aidSpecificData,
        };
      }
    }

    return prefilled;
  }

  /**
   * Fusionner deux formData (shallow merge)
   */
  private mergeFormData(
    existing: DossierFormData,
    update: Partial<DossierFormData>,
  ): DossierFormData {
    const merged: DossierFormData = { ...existing };

    if (update.personalInfo) {
      merged.personalInfo = {
        ...existing.personalInfo,
        ...update.personalInfo,
      };
    }

    if (update.aidSpecificData) {
      merged.aidSpecificData = {
        ...existing.aidSpecificData,
        ...update.aidSpecificData,
      };
    }

    if (update.declaredDocuments !== undefined) {
      merged.declaredDocuments = update.declaredDocuments;
    }

    return merged;
  }

  /**
   * Vérifier si une transition de statut est autorisée
   */
  private canTransition(
    from: DossierStatus,
    to: DossierStatus,
    isAdmin: boolean,
  ): boolean {
    const transitions = isAdmin
      ? ADMIN_STATUS_TRANSITIONS
      : USER_STATUS_TRANSITIONS;

    const allowedTransitions = transitions[from] || [];
    return allowedTransitions.includes(to);
  }

  /**
   * Vérifier l'accès à un dossier
   */
  private checkAccess(user: User, dossier: PrismaDossier): void {
    if (dossier.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Vous n\'avez pas accès à ce dossier',
      );
    }
  }

  /**
   * Convertir une entité Prisma Dossier en DTO Dossier complet
   */
  private toDossierDto(dossier: DossierWithAid): Dossier {
    const aidSummary: AidSummary = {
      id: dossier.aid.id,
      name: dossier.aid.name,
      slug: dossier.aid.slug,
      category: dossier.aid.category,
      shortDescription: dossier.aid.shortDescription,
      authority: dossier.aid.authority,
      geographicScope: dossier.aid.geographicScope,
      isActive: dossier.aid.isActive,
    };

    return {
      id: dossier.id,
      userId: dossier.userId,
      aidId: dossier.aidId,
      aidName: dossier.aid.name,
      aidCategory: dossier.aid.category as AidCategory,
      status: dossier.status as DossierStatus,
      aid: aidSummary,
      formData: dossier.formData as unknown as DossierFormData,
      generatedContent: dossier.generatedContent,
      userNotes: dossier.userNotes,
      externalReference: dossier.externalReference,
      createdAt: dossier.createdAt.toISOString(),
      updatedAt: dossier.updatedAt.toISOString(),
      submittedAt: dossier.submittedAt?.toISOString() ?? null,
    };
  }

  /**
   * Convertir une entité Prisma Dossier en DTO DossierSummary
   */
  private toDossierSummaryDto(dossier: DossierWithAid): DossierSummary {
    return {
      id: dossier.id,
      aidId: dossier.aidId,
      aidName: dossier.aid.name,
      aidCategory: dossier.aid.category as AidCategory,
      status: dossier.status as DossierStatus,
      createdAt: dossier.createdAt.toISOString(),
      updatedAt: dossier.updatedAt.toISOString(),
      submittedAt: dossier.submittedAt?.toISOString() ?? null,
    };
  }
}
