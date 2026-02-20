import { DossierStatus } from '../constants/enums';
import { AidSummary } from './aid';
/**
 * Données du formulaire d'un dossier
 */
export interface DossierFormData {
    personalInfo: {
        fullName?: string;
        birthDate?: string;
        address?: string;
        phone?: string;
        email?: string;
    };
    aidSpecificData?: Record<string, unknown>;
    declaredDocuments?: string[];
}
/**
 * Résumé d'un dossier (pour les listes)
 */
export interface DossierSummary {
    id: string;
    aidId: string;
    aidName: string;
    aidCategory: string;
    status: DossierStatus;
    createdAt: string;
    updatedAt: string;
    submittedAt: string | null;
}
/**
 * Dossier complet
 */
export interface Dossier extends DossierSummary {
    userId: string;
    aid: AidSummary;
    formData: DossierFormData;
    generatedContent: string | null;
    userNotes: string | null;
    externalReference: string | null;
}
/**
 * DTO pour créer un dossier
 */
export interface CreateDossierDto {
    aidId: string;
    /** Données initiales du formulaire (optionnel, sera pré-rempli depuis le profil) */
    formData?: Partial<DossierFormData>;
    userNotes?: string;
}
/**
 * DTO pour mettre à jour un dossier
 */
export interface UpdateDossierDto {
    status?: DossierStatus;
    formData?: Partial<DossierFormData>;
    userNotes?: string;
}
/**
 * Réponse création/détail dossier
 */
export interface DossierResponse {
    dossier: Dossier;
}
/**
 * Réponse liste des dossiers
 */
export interface DossiersListResponse {
    dossiers: DossierSummary[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
//# sourceMappingURL=dossier.d.ts.map