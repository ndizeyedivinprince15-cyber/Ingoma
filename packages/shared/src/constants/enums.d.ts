/**
 * Rôles utilisateur
 */
export declare const UserRole: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
/**
 * Statut professionnel
 */
export declare const ProfessionalStatus: {
    readonly ETUDIANT: "ETUDIANT";
    readonly SALARIE: "SALARIE";
    readonly INDEPENDANT: "INDEPENDANT";
    readonly CHOMEUR: "CHOMEUR";
    readonly RETRAITE: "RETRAITE";
    readonly INACTIF: "INACTIF";
};
export type ProfessionalStatus = (typeof ProfessionalStatus)[keyof typeof ProfessionalStatus];
/**
 * Situation familiale
 */
export declare const FamilyStatus: {
    readonly CELIBATAIRE: "CELIBATAIRE";
    readonly EN_COUPLE: "EN_COUPLE";
    readonly VEUF: "VEUF";
    readonly DIVORCE: "DIVORCE";
};
export type FamilyStatus = (typeof FamilyStatus)[keyof typeof FamilyStatus];
/**
 * Type de logement
 */
export declare const HousingType: {
    readonly APPARTEMENT: "APPARTEMENT";
    readonly MAISON: "MAISON";
    readonly AUTRE: "AUTRE";
};
export type HousingType = (typeof HousingType)[keyof typeof HousingType];
/**
 * Statut d'occupation du logement
 */
export declare const HousingStatus: {
    readonly LOCATAIRE: "LOCATAIRE";
    readonly PROPRIETAIRE: "PROPRIETAIRE";
    readonly HEBERGE_GRATUIT: "HEBERGE_GRATUIT";
    readonly SANS_DOMICILE: "SANS_DOMICILE";
};
export type HousingStatus = (typeof HousingStatus)[keyof typeof HousingStatus];
/**
 * Catégorie d'aide
 */
export declare const AidCategory: {
    readonly LOGEMENT: "LOGEMENT";
    readonly ENERGIE: "ENERGIE";
    readonly ETUDES: "ETUDES";
    readonly BUSINESS: "BUSINESS";
    readonly SANTE: "SANTE";
    readonly TRANSPORT: "TRANSPORT";
    readonly FAMILLE: "FAMILLE";
};
export type AidCategory = (typeof AidCategory)[keyof typeof AidCategory];
/**
 * Portée géographique
 */
export declare const GeographicScope: {
    readonly NATIONAL: "NATIONAL";
    readonly REGIONAL: "REGIONAL";
    readonly DEPARTEMENTAL: "DEPARTEMENTAL";
    readonly COMMUNAL: "COMMUNAL";
};
export type GeographicScope = (typeof GeographicScope)[keyof typeof GeographicScope];
/**
 * Statut de dossier
 */
export declare const DossierStatus: {
    readonly BROUILLON: "BROUILLON";
    readonly PRET: "PRET";
    readonly SOUMIS: "SOUMIS";
    readonly EN_COURS: "EN_COURS";
    readonly ACCEPTE: "ACCEPTE";
    readonly REFUSE: "REFUSE";
    readonly ANNULE: "ANNULE";
};
export type DossierStatus = (typeof DossierStatus)[keyof typeof DossierStatus];
//# sourceMappingURL=enums.d.ts.map