import { AidCategory, GeographicScope } from '../constants/enums';
import { EligibilityRules, EstimationRules } from './eligibility';
/**
 * Résumé d'une aide (pour les listes)
 */
export interface AidSummary {
    id: string;
    name: string;
    slug: string;
    category: AidCategory;
    shortDescription: string;
    authority: string;
    geographicScope: GeographicScope;
    isActive: boolean;
}
/**
 * Aide complète (pour le détail)
 */
export interface Aid extends AidSummary {
    longDescription: string | null;
    geographicZones: string[];
    eligibilityRules: EligibilityRules;
    estimationRules: EstimationRules | null;
    officialLink: string | null;
    requiredDocuments: string[];
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}
/**
 * DTO pour créer une aide (admin)
 */
export interface CreateAidDto {
    name: string;
    slug: string;
    category: AidCategory;
    shortDescription: string;
    longDescription?: string | null;
    authority: string;
    geographicScope: GeographicScope;
    geographicZones?: string[];
    eligibilityRules: EligibilityRules;
    estimationRules?: EstimationRules | null;
    officialLink?: string | null;
    requiredDocuments?: string[];
    displayOrder?: number;
    isActive?: boolean;
}
/**
 * DTO pour mettre à jour une aide (admin)
 * Tous les champs sont optionnels
 */
export interface UpdateAidDto extends Partial<CreateAidDto> {
}
/**
 * Paramètres de filtrage pour la liste des aides
 */
export interface AidFilters {
    category?: AidCategory;
    geographicScope?: GeographicScope;
    region?: string;
    department?: string;
    isActive?: boolean;
    search?: string;
}
/**
 * Réponse liste des aides
 */
export interface AidsListResponse {
    aids: AidSummary[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
/**
 * Réponse détail d'une aide
 */
export interface AidDetailResponse {
    aid: Aid;
}
//# sourceMappingURL=aid.d.ts.map