// apps/api/src/modules/aids/dto/create-aid.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  IsInt,
  IsUrl,
  IsObject,
  MaxLength,
  Matches,
  Min,
} from 'class-validator';
import {
  CreateAidDto as ICreateAidDto,
  AidCategory,
  GeographicScope,
  EligibilityRules,
  EstimationRules,
} from '@aidesmax/shared';

/**
 * DTO pour la création d'une nouvelle aide
 * 
 * Utilisé par les administrateurs pour ajouter des aides au catalogue.
 * Compatible avec l'interface CreateAidDto de @aidesmax/shared.
 */
export class CreateAidDto implements ICreateAidDto {
  @IsString({ message: 'Le nom est requis' })
  @IsNotEmpty({ message: 'Le nom ne peut pas être vide' })
  @MaxLength(200, { message: 'Le nom ne peut pas dépasser 200 caractères' })
  name: string;

  @IsString({ message: 'Le slug est requis' })
  @IsNotEmpty({ message: 'Le slug ne peut pas être vide' })
  @MaxLength(200, { message: 'Le slug ne peut pas dépasser 200 caractères' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Le slug doit être en minuscules avec des tirets (ex: aide-au-logement)',
  })
  slug: string;

  @IsEnum(AidCategory, {
    message: `La catégorie doit être l'une des valeurs suivantes : ${Object.values(AidCategory).join(', ')}`,
  })
  category: AidCategory;

  @IsString({ message: 'La description courte est requise' })
  @IsNotEmpty({ message: 'La description courte ne peut pas être vide' })
  @MaxLength(500, { message: 'La description courte ne peut pas dépasser 500 caractères' })
  shortDescription: string;

  @IsOptional()
  @IsString({ message: 'La description longue doit être une chaîne de caractères' })
  longDescription?: string | null;

  @IsString({ message: 'L\'autorité est requise' })
  @IsNotEmpty({ message: 'L\'autorité ne peut pas être vide' })
  @MaxLength(200, { message: 'L\'autorité ne peut pas dépasser 200 caractères' })
  authority: string;

  @IsEnum(GeographicScope, {
    message: `La portée géographique doit être l'une des valeurs suivantes : ${Object.values(GeographicScope).join(', ')}`,
  })
  geographicScope: GeographicScope;

  @IsOptional()
  @IsArray({ message: 'Les zones géographiques doivent être un tableau' })
  @IsString({ each: true, message: 'Chaque zone géographique doit être une chaîne' })
  geographicZones?: string[];

  @IsObject({ message: 'Les règles d\'éligibilité doivent être un objet' })
  @IsNotEmpty({ message: 'Les règles d\'éligibilité sont requises' })
  eligibilityRules: EligibilityRules;

  @IsOptional()
  @IsObject({ message: 'Les règles d\'estimation doivent être un objet' })
  estimationRules?: EstimationRules | null;

  @IsOptional()
  @IsUrl({}, { message: 'Le lien officiel doit être une URL valide' })
  officialLink?: string | null;

  @IsOptional()
  @IsArray({ message: 'Les documents requis doivent être un tableau' })
  @IsString({ each: true, message: 'Chaque document requis doit être une chaîne' })
  requiredDocuments?: string[];

  @IsOptional()
  @IsInt({ message: 'L\'ordre d\'affichage doit être un entier' })
  @Min(0, { message: 'L\'ordre d\'affichage doit être positif ou nul' })
  displayOrder?: number;

  @IsOptional()
  @IsBoolean({ message: 'Le champ isActive doit être un booléen' })
  isActive?: boolean;
}
