// apps/api/src/modules/profile/profile.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { UserProfile } from '@prisma/client';
import {
  UserProfile as UserProfileDto,
  ProfileResponse,
} from '@aidesmax/shared';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUpdateProfileDto } from './dto';

/**
 * Résultat de l'opération upsert
 * Indique si le profil a été créé ou mis à jour
 */
export interface UpsertResult {
  profile: UserProfileDto;
  created: boolean;
}

/**
 * Service Profile
 * 
 * Gère les opérations CRUD sur les profils d'éligibilité des utilisateurs.
 * Un utilisateur ne peut avoir qu'un seul profil (relation 1:1).
 */
@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupérer le profil d'un utilisateur
   * 
   * @param userId - ID de l'utilisateur
   * @returns Le profil DTO ou null si non trouvé
   */
  async getProfileForUser(userId: string): Promise<UserProfileDto | null> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return null;
    }

    return this.toUserProfileDto(profile);
  }

  /**
   * Créer ou mettre à jour le profil d'un utilisateur
   * 
   * @param userId - ID de l'utilisateur
   * @param dto - Données du profil
   * @returns Le profil créé/mis à jour et un flag indiquant si c'est une création
   */
  async upsertProfileForUser(
    userId: string,
    dto: CreateUpdateProfileDto,
  ): Promise<UpsertResult> {
    // Vérifier si un profil existe déjà
    const existingProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    const isCreation = !existingProfile;

    // Préparer les données pour Prisma
    const profileData = {
      age: dto.age,
      professionalStatus: dto.professionalStatus,
      familyStatus: dto.familyStatus,
      childrenCount: dto.childrenCount,
      annualIncome: dto.annualIncome,
      postalCode: dto.postalCode,
      department: dto.department,
      region: dto.region,
      housingType: dto.housingType,
      housingStatus: dto.housingStatus,
      housingConstructionYear: dto.housingConstructionYear ?? null,
      hasRenovationProject: dto.hasRenovationProject,
      hasBusinessProject: dto.hasBusinessProject,
      isStudent: dto.isStudent,
      // Stocker les données brutes pour référence future
      rawData: dto as object,
    };

    let profile: UserProfile;

    if (isCreation) {
      // Création d'un nouveau profil
      profile = await this.prisma.userProfile.create({
        data: {
          userId,
          ...profileData,
        },
      });
      this.logger.log(`Nouveau profil créé pour l'utilisateur ${userId}`);
    } else {
      // Mise à jour du profil existant
      profile = await this.prisma.userProfile.update({
        where: { userId },
        data: profileData,
      });
      this.logger.log(`Profil mis à jour pour l'utilisateur ${userId}`);
    }

    return {
      profile: this.toUserProfileDto(profile),
      created: isCreation,
    };
  }

  /**
   * Vérifier si un utilisateur a un profil
   * 
   * @param userId - ID de l'utilisateur
   * @returns true si le profil existe
   */
  async hasProfile(userId: string): Promise<boolean> {
    const count = await this.prisma.userProfile.count({
      where: { userId },
    });
    return count > 0;
  }

  /**
   * Supprimer le profil d'un utilisateur
   * Utilisé principalement pour le RGPD (suppression de compte)
   * 
   * @param userId - ID de l'utilisateur
   * @returns true si un profil a été supprimé
   */
  async deleteProfileForUser(userId: string): Promise<boolean> {
    try {
      await this.prisma.userProfile.delete({
        where: { userId },
      });
      this.logger.log(`Profil supprimé pour l'utilisateur ${userId}`);
      return true;
    } catch {
      // Le profil n'existait pas
      return false;
    }
  }

  /**
   * Récupérer un profil par son ID (pas par userId)
   * Utile pour le moteur d'éligibilité
   * 
   * @param profileId - ID du profil
   * @returns Le profil DTO ou null
   */
  async getProfileById(profileId: string): Promise<UserProfileDto | null> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return null;
    }

    return this.toUserProfileDto(profile);
  }

  /**
   * Convertir une entité Prisma UserProfile en DTO partagé
   * 
   * @param profile - Entité Prisma
   * @returns DTO conforme à @aidesmax/shared
   */
  private toUserProfileDto(profile: UserProfile): UserProfileDto {
    return {
      id: profile.id,
      userId: profile.userId,
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
      rawData: profile.rawData as Record<string, unknown> | null,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
