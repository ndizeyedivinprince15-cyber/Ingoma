// apps/api/src/modules/eligibility/dto/evaluate-eligibility.dto.ts

import {
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  EvaluateEligibilityDto as IEvaluateEligibilityDto,
  ProfileData,
  AidCategory,
} from '@aidesmax/shared';

/**
 * DTO pour l'évaluation d'éligibilité
 * 
 * Supporte deux modes :
 * - Mode anonyme : profileData obligatoire, pas de persistance
 * - Mode connecté : profileData optionnel, persistance possible
 * 
 * Compatible avec l'interface EvaluateEligibilityDto de @aidesmax/shared
 */
export class EvaluateEligibilityDto implements IEvaluateEligibilityDto {
  /**
   * Données du profil pour évaluation directe
   * Si fourni, prend la priorité sur profileId
   */
  @IsOptional()
  @IsObject({ message: 'profileData doit être un objet' })
  profileData?: ProfileData;

  /**
   * ID d'un profil existant en base
   * Ignoré si profileData est fourni
   */
  @IsOptional()
  @IsString({ message: 'profileId doit être une chaîne de caractères' })
  profileId?: string;

  /**
   * Filtrer par catégorie d'aide
   */
  @IsOptional()
  @IsEnum(AidCategory, {
    message: `La catégorie doit être l'une des valeurs suivantes : ${Object.values(AidCategory).join(', ')}`,
  })
  category?: AidCategory;

  /**
   * Filtrer par IDs d'aides spécifiques
   */
  @IsOptional()
  @IsArray({ message: 'aidIds doit être un tableau' })
  @IsString({ each: true, message: 'Chaque aidId doit être une chaîne' })
  aidIds?: string[];

  /**
   * Si true et utilisateur connecté avec profil stocké, persiste les résultats
   * Défaut: true pour les utilisateurs connectés utilisant leur profil
   */
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean({ message: 'persistResults doit être un booléen' })
  persistResults?: boolean;
}
