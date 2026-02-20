// apps/api/src/modules/eligibility/eligibility.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  ProfileData,
  Aid,
  AidCategory,
  AidEligibilityResult,
  EligibilityEvaluationResponse,
  CriterionResult,
} from '@aidesmax/shared';
import { PrismaService } from '../prisma/prisma.service';
import { AidsService } from '../aids/aids.service';
import { ProfileService } from '../profile/profile.service';
import { EligibilityEngineService } from './eligibility-engine.service';
import { EvaluateEligibilityDto } from './dto';

/**
 * Service d'éligibilité
 * 
 * Orchestre l'évaluation de l'éligibilité et la persistance des résultats.
 * Fait le lien entre le controller, le moteur de règles, et les autres services.
 */
@Injectable()
export class EligibilityService {
  private readonly logger = new Logger(EligibilityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aidsService: AidsService,
    private readonly profileService: ProfileService,
    private readonly eligibilityEngine: EligibilityEngineService,
  ) {}

  /**
   * Évaluer l'éligibilité pour des données de profil (sans persistance)
   * 
   * @param profile - Données du profil à évaluer
   * @param opts - Options de filtrage
   * @returns Liste des résultats d'éligibilité par aide
   */
  async evaluateForProfileData(
    profile: ProfileData,
    opts?: { category?: AidCategory; aidIds?: string[] },
  ): Promise<AidEligibilityResult[]> {
    // Récupérer les aides actives avec les filtres
    const aids = await this.aidsService.findAllActive({
      category: opts?.category,
      aidIds: opts?.aidIds,
    });

    // Évaluer chaque aide
    const results: AidEligibilityResult[] = [];
    for (const aid of aids) {
      const result = this.eligibilityEngine.evaluateAidForProfile(profile, aid);
      results.push(result);
    }

    // Trier : éligibles d'abord, puis par score décroissant
    results.sort((a, b) => {
      if (a.isEligible !== b.isEligible) {
        return a.isEligible ? -1 : 1;
      }
      return b.probabilityScore - a.probabilityScore;
    });

    return results;
  }

  /**
   * Évaluer l'éligibilité avec gestion de la persistance
   * 
   * Comportement :
   * - Mode anonyme (userId null) : évaluation sans persistance
   * - Mode connecté :
   *   - Si profileData fourni : évaluation sans persistance (recalcul ponctuel)
   *   - Sinon : utilise le profil stocké + persistance optionnelle
   * 
   * @param userId - ID de l'utilisateur connecté (null si anonyme)
   * @param dto - Options d'évaluation
   * @returns Réponse complète avec résultats et métadonnées
   */
  async evaluateAndMaybePersist(
    userId: string | null,
    dto: EvaluateEligibilityDto,
  ): Promise<EligibilityEvaluationResponse> {
    // 1. Déterminer le profil à utiliser
    const { profile, profileId, shouldPersist } = await this.resolveProfile(
      userId,
      dto,
    );

    // 2. Évaluer l'éligibilité
    const results = await this.evaluateForProfileData(profile, {
      category: dto.category,
      aidIds: dto.aidIds,
    });

    // 3. Persister si nécessaire
    if (shouldPersist && profileId) {
      await this.persistResults(profileId, results);
    }

    // 4. Construire la réponse
    const eligibleCount = results.filter((r) => r.isEligible).length;
    const evaluatedAt = new Date().toISOString();

    const response: EligibilityEvaluationResponse = {
      results,
      totalAidsEvaluated: results.length,
      eligibleCount,
      evaluatedAt,
      persisted: shouldPersist && profileId !== undefined,
      ...(profileId && { profileId }),
    };

    this.logger.log(
      `Évaluation terminée : ${results.length} aides, ${eligibleCount} éligibles, ` +
      `persisté=${response.persisted}`,
    );

    return response;
  }

  /**
   * Résoudre le profil à utiliser pour l'évaluation
   * 
   * Logique de priorité :
   * 1. dto.profileData (fourni directement) → pas de persistance
   * 2. dto.profileId (référence explicite) → persistance possible
   * 3. Profil de l'utilisateur connecté → persistance possible
   * 4. Erreur si aucune source de profil
   */
  private async resolveProfile(
    userId: string | null,
    dto: EvaluateEligibilityDto,
  ): Promise<{
    profile: ProfileData;
    profileId?: string;
    shouldPersist: boolean;
  }> {
    // Cas 1 : profileData fourni directement
    if (dto.profileData) {
      this.logger.debug('Utilisation du profileData fourni (pas de persistance)');
      return {
        profile: dto.profileData,
        profileId: undefined,
        shouldPersist: false, // Jamais de persistance avec profileData direct
      };
    }

    // Cas 2 : profileId fourni
    if (dto.profileId) {
      const userProfile = await this.profileService.getProfileById(dto.profileId);
      if (!userProfile) {
        throw new NotFoundException(
          `Profil "${dto.profileId}" non trouvé`,
        );
      }

      const profile = this.userProfileToProfileData(userProfile);
      const shouldPersist = userId !== null && dto.persistResults !== false;

      this.logger.debug(
        `Utilisation du profil ${dto.profileId}, persistance=${shouldPersist}`,
      );

      return {
        profile,
        profileId: userProfile.id,
        shouldPersist,
      };
    }

    // Cas 3 : Utilisateur connecté → utiliser son profil
    if (userId) {
      const userProfile = await this.profileService.getProfileForUser(userId);
      if (!userProfile) {
        throw new NotFoundException(
          'Aucun profil trouvé. Veuillez compléter le questionnaire.',
        );
      }

      const profile = this.userProfileToProfileData(userProfile);
      const shouldPersist = dto.persistResults !== false;

      this.logger.debug(
        `Utilisation du profil utilisateur ${userId}, persistance=${shouldPersist}`,
      );

      return {
        profile,
        profileId: userProfile.id,
        shouldPersist,
      };
    }

    // Cas 4 : Aucune source de profil
    throw new BadRequestException(
      'Aucune donnée de profil fournie. Veuillez fournir profileData ou vous connecter.',
    );
  }

  /**
   * Convertir un UserProfile DTO en ProfileData
   */
  private userProfileToProfileData(userProfile: {
    age: number;
    professionalStatus: string;
    familyStatus: string;
    childrenCount: number;
    annualIncome: number;
    postalCode: string;
    department: string;
    region: string;
    housingType: string;
    housingStatus: string;
    housingConstructionYear?: number | null;
    hasRenovationProject: boolean;
    hasBusinessProject: boolean;
    isStudent: boolean;
  }): ProfileData {
    return {
      age: userProfile.age,
      professionalStatus: userProfile.professionalStatus as ProfileData['professionalStatus'],
      familyStatus: userProfile.familyStatus as ProfileData['familyStatus'],
      childrenCount: userProfile.childrenCount,
      annualIncome: userProfile.annualIncome,
      postalCode: userProfile.postalCode,
      department: userProfile.department,
      region: userProfile.region,
      housingType: userProfile.housingType as ProfileData['housingType'],
      housingStatus: userProfile.housingStatus as ProfileData['housingStatus'],
      housingConstructionYear: userProfile.housingConstructionYear ?? undefined,
      hasRenovationProject: userProfile.hasRenovationProject,
      hasBusinessProject: userProfile.hasBusinessProject,
      isStudent: userProfile.isStudent,
    };
  }

  /**
   * Persister les résultats d'éligibilité en base
   * Utilise un upsert pour éviter les doublons
   */
  private async persistResults(
    userProfileId: string,
    results: AidEligibilityResult[],
  ): Promise<void> {
    this.logger.debug(
      `Persistance de ${results.length} résultats pour le profil ${userProfileId}`,
    );

    // Utiliser une transaction pour garantir la cohérence
    await this.prisma.$transaction(async (tx) => {
      for (const result of results) {
        const data: Prisma.EligibilityResultCreateInput = {
          userProfile: { connect: { id: userProfileId } },
          aid: { connect: { id: result.aidId } },
          isEligible: result.isEligible,
          probabilityScore: result.probabilityScore,
          estimatedAmountMin: result.estimatedAmountMin,
          estimatedAmountMax: result.estimatedAmountMax,
          criteriaResults: result.criteriaResults as unknown as Prisma.InputJsonValue,
          explanation: result.explanation,
          evaluatedAt: new Date(),
        };

        await tx.eligibilityResult.upsert({
          where: {
            userProfileId_aidId: {
              userProfileId,
              aidId: result.aidId,
            },
          },
          update: {
            isEligible: data.isEligible,
            probabilityScore: data.probabilityScore,
            estimatedAmountMin: data.estimatedAmountMin,
            estimatedAmountMax: data.estimatedAmountMax,
            criteriaResults: data.criteriaResults,
            explanation: data.explanation,
            evaluatedAt: data.evaluatedAt,
          },
          create: data,
        });
      }
    });

    this.logger.log(
      `${results.length} résultats persistés pour le profil ${userProfileId}`,
    );
  }

  /**
   * Récupérer les résultats d'éligibilité stockés pour un profil
   * (Optionnel, utile pour l'historique)
   */
  async getStoredResults(userProfileId: string): Promise<AidEligibilityResult[]> {
    const storedResults = await this.prisma.eligibilityResult.findMany({
      where: { userProfileId },
      include: { aid: true },
      orderBy: { evaluatedAt: 'desc' },
    });

    return storedResults.map((stored) => ({
      aidId: stored.aidId,
      aid: {
        id: stored.aid.id,
        name: stored.aid.name,
        slug: stored.aid.slug,
        category: stored.aid.category,
        shortDescription: stored.aid.shortDescription,
        authority: stored.aid.authority,
        geographicScope: stored.aid.geographicScope,
        isActive: stored.aid.isActive,
      },
      isEligible: stored.isEligible,
      probabilityScore: stored.probabilityScore,
      estimatedAmountMin: stored.estimatedAmountMin,
      estimatedAmountMax: stored.estimatedAmountMax,
      criteriaResults: stored.criteriaResults as unknown as CriterionResult[],
      explanation: stored.explanation || '',
    }));
  }
}
