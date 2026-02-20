// apps/api/src/modules/dossiers/dto/dossier-filters.dto.ts

import {
  IsOptional,
  IsInt,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  DossierFilters,
  DossierStatus,
  AidCategory,
  PaginationParams,
} from '@aidesmax/shared';

/**
 * DTO pour les filtres de recherche des dossiers
 * 
 * Utilisé en query params pour GET /api/dossiers
 * Tous les champs sont optionnels.
 */
export class DossierFiltersDto implements DossierFilters, PaginationParams {
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
  // FILTRES
  // ═══════════════════════════════════════════════════════════════════════

  @IsOptional()
  @IsEnum(DossierStatus, {
    message: `Le statut doit être l'une des valeurs suivantes : ${Object.values(DossierStatus).join(', ')}`,
  })
  status?: DossierStatus;

  @IsOptional()
  @IsEnum(AidCategory, {
    message: `La catégorie doit être l'une des valeurs suivantes : ${Object.values(AidCategory).join(', ')}`,
  })
  aidCategory?: AidCategory;
}
