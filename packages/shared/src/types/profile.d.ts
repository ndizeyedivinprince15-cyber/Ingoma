import { ProfessionalStatus, FamilyStatus, HousingType, HousingStatus } from '../constants/enums';
/**
 * Données du profil d'éligibilité (réponses au questionnaire)
 * Utilisé pour la création/mise à jour et pour l'évaluation anonyme
 */
export interface ProfileData {
    age: number;
    professionalStatus: ProfessionalStatus;
    familyStatus: FamilyStatus;
    childrenCount: number;
    annualIncome: number;
    postalCode: string;
    department: string;
    region: string;
    housingType: HousingType;
    housingStatus: HousingStatus;
    housingConstructionYear?: number | null;
    hasRenovationProject: boolean;
    hasBusinessProject: boolean;
    isStudent: boolean;
}
/**
 * Profil d'éligibilité complet (stocké en base)
 */
export interface UserProfile extends ProfileData {
    id: string;
    userId: string | null;
    rawData?: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
}
/**
 * DTO pour créer/mettre à jour un profil
 */
export interface CreateUpdateProfileDto extends ProfileData {
}
/**
 * Réponse de l'API profil
 */
export interface ProfileResponse {
    profile: UserProfile;
}
//# sourceMappingURL=profile.d.ts.map