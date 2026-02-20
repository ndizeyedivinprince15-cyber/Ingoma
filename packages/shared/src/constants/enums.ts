// packages/shared/src/constants/enums.ts

/**
 * Rôles utilisateur
 */
export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * Statut professionnel
 */
export const ProfessionalStatus = {
  ETUDIANT: 'ETUDIANT',
  SALARIE: 'SALARIE',
  INDEPENDANT: 'INDEPENDANT',
  CHOMEUR: 'CHOMEUR',
  RETRAITE: 'RETRAITE',
  INACTIF: 'INACTIF',
} as const;
export type ProfessionalStatus = (typeof ProfessionalStatus)[keyof typeof ProfessionalStatus];

/**
 * Situation familiale
 */
export const FamilyStatus = {
  CELIBATAIRE: 'CELIBATAIRE',
  EN_COUPLE: 'EN_COUPLE',
  VEUF: 'VEUF',
  DIVORCE: 'DIVORCE',
} as const;
export type FamilyStatus = (typeof FamilyStatus)[keyof typeof FamilyStatus];

/**
 * Type de logement
 */
export const HousingType = {
  APPARTEMENT: 'APPARTEMENT',
  MAISON: 'MAISON',
  AUTRE: 'AUTRE',
} as const;
export type HousingType = (typeof HousingType)[keyof typeof HousingType];

/**
 * Statut d'occupation du logement
 */
export const HousingStatus = {
  LOCATAIRE: 'LOCATAIRE',
  PROPRIETAIRE: 'PROPRIETAIRE',
  HEBERGE_GRATUIT: 'HEBERGE_GRATUIT',
  SANS_DOMICILE: 'SANS_DOMICILE',
} as const;
export type HousingStatus = (typeof HousingStatus)[keyof typeof HousingStatus];

/**
 * Catégorie d'aide
 */
export const AidCategory = {
  LOGEMENT: 'LOGEMENT',
  ENERGIE: 'ENERGIE',
  ETUDES: 'ETUDES',
  BUSINESS: 'BUSINESS',
  SANTE: 'SANTE',
  TRANSPORT: 'TRANSPORT',
  FAMILLE: 'FAMILLE',
} as const;
export type AidCategory = (typeof AidCategory)[keyof typeof AidCategory];

/**
 * Portée géographique
 */
export const GeographicScope = {
  NATIONAL: 'NATIONAL',
  REGIONAL: 'REGIONAL',
  DEPARTEMENTAL: 'DEPARTEMENTAL',
  COMMUNAL: 'COMMUNAL',
} as const;
export type GeographicScope = (typeof GeographicScope)[keyof typeof GeographicScope];

/**
 * Statut de dossier
 */
export const DossierStatus = {
  BROUILLON: 'BROUILLON',
  PRET: 'PRET',
  SOUMIS: 'SOUMIS',
  EN_COURS: 'EN_COURS',
  ACCEPTE: 'ACCEPTE',
  REFUSE: 'REFUSE',
  ANNULE: 'ANNULE',
} as const;
export type DossierStatus = (typeof DossierStatus)[keyof typeof DossierStatus];
