// apps/api/src/modules/profile/dto/create-update-profile.dto.ts

import {
  IsInt,
  IsString,
  IsBoolean,
  IsEnum,
  IsOptional,
  Min,
  Max,
  Length,
  Matches,
} from 'class-validator';
import {
  CreateUpdateProfileDto as ICreateUpdateProfileDto,
  ProfessionalStatus,
  FamilyStatus,
  HousingType,
  HousingStatus,
} from '@aidesmax/shared';

/**
 * DTO pour la création ou mise à jour du profil d'éligibilité
 * 
 * Contient toutes les réponses au questionnaire nécessaires
 * pour évaluer l'éligibilité aux différentes aides.
 * 
 * Compatible avec l'interface CreateUpdateProfileDto de @aidesmax/shared
 */
export class CreateUpdateProfileDto implements ICreateUpdateProfileDto {
  // ═══════════════════════════════════════════════════════════════════════
  // INFORMATIONS PERSONNELLES
  // ═══════════════════════════════════════════════════════════════════════

  @IsInt({ message: 'L\'âge doit être un nombre entier' })
  @Min(0, { message: 'L\'âge doit être positif' })
  @Max(120, { message: 'L\'âge doit être inférieur à 120 ans' })
  age: number;

  @IsEnum(ProfessionalStatus, {
    message: `Le statut professionnel doit être l'une des valeurs suivantes : ${Object.values(ProfessionalStatus).join(', ')}`,
  })
  professionalStatus: ProfessionalStatus;

  @IsEnum(FamilyStatus, {
    message: `La situation familiale doit être l'une des valeurs suivantes : ${Object.values(FamilyStatus).join(', ')}`,
  })
  familyStatus: FamilyStatus;

  @IsInt({ message: 'Le nombre d\'enfants doit être un nombre entier' })
  @Min(0, { message: 'Le nombre d\'enfants doit être positif ou nul' })
  childrenCount: number;

  // ═══════════════════════════════════════════════════════════════════════
  // INFORMATIONS FINANCIÈRES
  // ═══════════════════════════════════════════════════════════════════════

  @IsInt({ message: 'Le revenu annuel doit être un nombre entier' })
  @Min(0, { message: 'Le revenu annuel doit être positif ou nul' })
  annualIncome: number;

  // ═══════════════════════════════════════════════════════════════════════
  // INFORMATIONS GÉOGRAPHIQUES
  // ═══════════════════════════════════════════════════════════════════════

  @IsString({ message: 'Le code postal est requis' })
  @Length(5, 5, { message: 'Le code postal doit contenir exactement 5 caractères' })
  @Matches(/^\d{5}$/, { message: 'Le code postal doit contenir 5 chiffres' })
  postalCode: string;

  @IsString({ message: 'Le département est requis' })
  @Length(2, 3, { message: 'Le code département doit contenir 2 ou 3 caractères' })
  department: string;

  @IsString({ message: 'La région est requise' })
  @Length(1, 100, { message: 'La région ne peut pas être vide' })
  region: string;

  // ═══════════════════════════════════════════════════════════════════════
  // INFORMATIONS LOGEMENT
  // ═══════════════════════════════════════════════════════════════════════

  @IsEnum(HousingType, {
    message: `Le type de logement doit être l'une des valeurs suivantes : ${Object.values(HousingType).join(', ')}`,
  })
  housingType: HousingType;

  @IsEnum(HousingStatus, {
    message: `Le statut d'occupation doit être l'une des valeurs suivantes : ${Object.values(HousingStatus).join(', ')}`,
  })
  housingStatus: HousingStatus;

  @IsOptional()
  @IsInt({ message: 'L\'année de construction doit être un nombre entier' })
  @Min(1800, { message: 'L\'année de construction doit être supérieure à 1800' })
  @Max(new Date().getFullYear(), { message: 'L\'année de construction ne peut pas être dans le futur' })
  housingConstructionYear?: number | null;

  // ═══════════════════════════════════════════════════════════════════════
  // PROJETS
  // ═══════════════════════════════════════════════════════════════════════

  @IsBoolean({ message: 'Le champ projet de rénovation doit être un booléen' })
  hasRenovationProject: boolean;

  @IsBoolean({ message: 'Le champ projet de création d\'entreprise doit être un booléen' })
  hasBusinessProject: boolean;

  @IsBoolean({ message: 'Le champ étudiant doit être un booléen' })
  isStudent: boolean;
}
