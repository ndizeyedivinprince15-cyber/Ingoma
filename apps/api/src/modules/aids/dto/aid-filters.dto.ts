// apps/api/src/modules/aids/dto/aid-filters.dto.ts

import {
  IsOptional,
  IsInt,
  IsEnum,
  IsString,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  AidFilters as IAidFilters,
  AidCategory,
  GeographicScope,
  PaginationParams,
} from '@aidesmax/shared';

/**
 * DTO pour les filtres de recherche des aides
 * 
 * Utilisé en query params pour GET /api/aids
 * Tous les champs sont optionnels.
 */
export class AidFiltersDto implements IAidFilters, PaginationParams {
  // ═══════════════════════════════════════════════════════════════════════
  // PAGINATION
  // ═══════════════════════════════════════════════════════════════════════

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La page doit être un entier' })
  @Min(1, { message: 'La page doit être au minimum 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La limite doit être un entier' })
  @Min(1, { message: 'La limite doit être au minimum 1' })
  @Max(100, { message: 'La limite ne peut pas dépasser 100' })
  limit?: number = 20;

  // ═══════════════════════════════════════════════════════════════════════
  // FILTRES MÉTIER
  // ═══════════════════════════════════════════════════════════════════════

  @IsOptional()
  @IsEnum(AidCategory, {
    message: `La catégorie doit être l'une des valeurs suivantes : ${Object.values(AidCategory).join(', ')}`,
  })
  category?: AidCategory;

  @IsOptional()
  @IsEnum(GeographicScope, {
    message: `La portée géographique doit être l'une des valeurs suivantes : ${Object.values(GeographicScope).join(', ')}`,
  })
  geographicScope?: GeographicScope;

  @IsOptional()
  @IsString({ message: 'La région doit être une chaîne de caractères' })
  region?: string;

  @IsOptional()
  @IsString({ message: 'Le département doit être une chaîne de caractères' })
  department?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'isActive doit être un booléen' })
  isActive?: boolean = true;

  @IsOptional()
  @IsString({ message: 'La recherche doit être une chaîne de caractères' })
  search?: string;
}
